<?php
/**
 * CarWashManager
 *
 * @author freshDivide
 * @date 2016/08/06
 */

class CarWashManager {
    /**
     * get data from CarPlateStyle model
     * @return all sytle_name and sample_img of car license
     */
    public static function getAreaOptionInfo(){
        $criteria = new CDbCriteria();
        $criteria->select = "a.area_full_name, t.city_name";
        $criteria->join = "JOIN car_avaliable_area a ON a.area_id=t.city_area_id";
        $records = CarAvaliableCity::model()->with('area')->findAll($criteria);
        #$records = CarAvaliableCity::model()->findAll($criteria);
        #$records = CarAvaliableCity::model()->findByPk(1);
        /*
        $sql = "SELECT area_full_name FROM car_avaliable_area;";
        $records = CarAvaliableArea ::model()->findAllBySql($sql);
        */
        return $records;
    }

    public static function getWashType(){
        $criteria = new CDbCriteria();
        $criteria->select = "service_id,service_name";
        $records = CarWashType::model()->findAll($criteria);

        return $records;
    }

    public static function getWashRange(){
        $criteria = new CDbCriteria();
        $criteria->select = "range_id,range_name";
        $records = CarWashRange::model()->findAll($criteria);

        return $records;
    }

    public static function getShopList($userid, $address, $type, $range, $coordinate){
        $criteria = new CDbCriteria();
        $criteria->select = "range_threshold";
        $criteria->condition = "range_name='".$range."'";
        $record_rag = CarWashRange::model()->find($criteria);
        
        $criteria = new CDbCriteria();
        $criteria->select = "service_id,service_price";
        $criteria->condition = "service_name='".$type."'";
        $record_tpe = CarWashType::model()->find($criteria);

        $criteria = new CDbCriteria();
        $criteria->select = "shop_image_url,shop_name,shop_start_time,shop_end_time,shop_star,shop_lat,shop_lon,shop_fans,shop_wash_type,shop_address,shop_id";
        $criteria->condition = "shop_province='".$address['province']."' and shop_city ='".$address['city']."'";
        $record_shps = ShopInfo::model()->findAll($criteria);

        if ($record_rag == null || $record_tpe == null || $record_shps == null) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "未查询到符合条件的商家!",
                    "data" => array()
                );
            return $ret_json;
        } else {
            $service_id = $record_tpe->service_id;
            $service_price = $record_tpe->service_price;
            $range_threshold = $record_rag->range_threshold;
        }
        
        $ret_data = array();
        $host_info = Yii::app()->request->hostInfo;
        foreach ($record_shps as $record_shp) {
            $shop_wash_type = $record_shp->shop_wash_type;
            $shop_wash_type_l = explode('|', $shop_wash_type);
            $distance = ToolManager::caculateDistanceByLatLon($coordinate['lat'], $coordinate['lon'], $record_shp->shop_lat, $record_shp->shop_lon);
            $distance = number_format($distance, 2);
            if (in_array($service_id, $shop_wash_type_l) && $distance <= $range_threshold/1000) {
                $shop_info = array(
                        "imgUrl" => trim($host_info, '/')."/".$record_shp->shop_image_url,
                        "shop_id" => $record_shp->shop_id,
                        "title" => $record_shp->shop_name,
                        "price" => $service_price,
                        "time" => $record_shp->shop_start_time.":".$record_shp->shop_end_time,
                        "choice" => "空闲",
                        "evaluate" => $record_shp->shop_star,
                        "distance" => $distance."km",
                        "address" => $record_shp->shop_address,
                        "coordinate" => array(
                                "lat" => $record_shp->shop_lat,
                                "lon" => $record_shp->shop_lon,
                        )
                );
                $ret_data[] = $shop_info; 
            }
        }

        $ret_json = array(
                "status" => 0,
                "message" => "获取商家列表成功！",
                "data" => $ret_data
            );

        return $ret_data;
    }

    public static function getShopDetail($user_id, $shop_id){
        $host_info = Yii::app()->request->hostInfo;

        $criteria = new CDbCriteria();
        $record_tpes = CarWashType::model()->findAll($criteria);

        $criteria = new CDbCriteria();
        $record_pays = PayType::model()->findAll($criteria);

        $criteria = new CDbCriteria();
        $criteria->condition = "shop_id='".$shop_id."'";
        $record_shp = ShopInfo::model()->find($criteria);

        if ($record_tpes == null || $record_pays == null || $record_shp == null) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "未查询到商家信息!",
                    "data" => array()
                );
            return $ret_json;
        }
        
        $shop_wash_type = $record_shp->shop_wash_type;
        $shop_wash_type_l = explode('|', $shop_wash_type);
        $washing = array();
        foreach ($record_tpes as $record_tpe) {
            if (in_array($record_tpe->service_id, $shop_wash_type_l)) {
                $washing[] = array(
                        "id" => $record_tpe->service_id,
                        "name" => $record_tpe->service_name
                );
            }
        }

        $shop_payment = $record_shp->shop_payment;
        $shop_payment_l = explode('|', $shop_payment);
        $paytype = array();
        foreach ($record_pays as $record_pay) {
            if (in_array($record_pay->id, $shop_payment_l)) {
                $paytype[] = array(
                        "type" => $record_pay->type,
                        "icon_url" => trim($host_info, '/')."/".$record_pay->icon_url
                );
            }
        }

        $shop_services = $record_shp->shop_services;
        $shop_services_l = explode('|', $shop_services);

        $shop_fans = $record_shp->shop_fans;
        $shop_fans_l = explode('|', $shop_fans);
        if (in_array($user_id, $shop_fans_l)) {
            $wethercollect = 1;
        } else {
            $wethercollect = 0;
        }

        $shop_info = array(
                "imgUrl" => trim($host_info, '/')."/".$record_shp->shop_image_url,
                "shop_name" => $record_shp->shop_name,
                "star" => $record_shp->shop_star,
                "telephone" => $record_shp->shop_phone,
                "business_hours" => array(
                        "start" => $record_shp->shop_start_time,
                        "end" => $record_shp->shop_end_time
                        ),
                "wethercollect" => $wethercollect,
                "paytype" => $paytype,
                "aboutus" => $record_shp->shop_about_us,
                "services" => $shop_services_l,
                "washing" => $washing
        );

        $ret_json = array(
                "status" => 0,
                "message" => "获取商家列表成功！",
                "data" => array($shop_info)
            );

        return $ret_json;
    }

    public static function collectShop($user_id, $shop_id){
        $criteria = new CDbCriteria();
        $criteria->condition = "shop_id='".$shop_id."'";
        $record_shp = ShopInfo::model()->find($criteria);
       
        $ret_json = array(
                    "status" => 0,
                    "message" => "店铺收藏成功！",
                    "data" => array()
        );

        if ($record_shp == null) {
               $ret_json["status"] = 1;
               $ret_json["message"] = "店铺不存在，收藏失败!"; 
        } else {
            try{
                $record_shp->shop_fans = $record_shp->shop_fans."|".$user_id;
                $record_shp->save();
            } catch (Exception $ex){
               $ret_json["status"] = 1;
               $ret_json["message"] = "数据库更新失败，收藏失败!"; 
            }
        }

        return $ret_json;
    }

    public static function cancelCollectShop($user_id, $shop_id){
        $criteria = new CDbCriteria();
        $criteria->condition = "shop_id='".$shop_id."'";
        $record_shp = ShopInfo::model()->find($criteria);
       
        $ret_json = array(
                    "status" => 0,
                    "message" => "取消收藏成功！",
                    "data" => array()
        );

        if ($record_shp == null) {
               $ret_json["status"] = 1;
               $ret_json["message"] = "店铺不存在，取消收藏失败!"; 
        } else {
            try{
                $shop_fans = $record_shp->shop_fans;
                $shop_fans_l = explode('|', $shop_fans);
                $index = array_search($user_id, $shop_fans_l);
                if ($index !== false){
                    array_splice($shop_fans_l, $index, 1);
                }
                $record_shp->shop_fans = implode("|", $shop_fans_l);
                $record_shp->save();
            } catch (Exception $ex){
               $ret_json["status"] = 1;
               $ret_json["message"] = "数据库更新失败，取消收藏失败!"; 
            }
        }

        return $ret_json;
    }

    public static function submitOrder($user_id, $shop_id, $washing, $washing_time, $message){
        $ret_json = array(
                    "status" => 0,
                    "message" => "提交订单成功!",
                    "data" => array()
        );
        $order_id = ToolManager::genOrderNum();
        $car_wash_order_info = new CarWashOrderInfo;
        $car_wash_order_info->order_id = $order_id;
        $car_wash_order_info->userid = $user_id;
        $car_wash_order_info->shop_id = $shop_id;
        $car_wash_order_info->washing_time = $washing_time;
        $car_wash_order_info->washing = implode("|", $washing);
        $car_wash_order_info->message = $message;
        $car_wash_order_info->create_time = date('y-m-d h:i:s',time());

        try{
            $car_wash_order_info->save();
        } catch (Exception $ex){
           $ret_json["status"] = 1;
           $ret_json["message"] = "数据库更新失败，提交订单失败!"; 
        }

        $ret_json['data'] = array(array(
                "order_id" => $order_id,
            )
        );

        return $ret_json;
    }
    
    public static function subscribeSuccess($order_id){
        $criteria = new CDbCriteria();
        $criteria->select = "shop_id,washing";
        $criteria->condition = "order_id='".$order_id."'";
        $record_odr = CarWashOrderInfo::model()->find($criteria);
        
        $criteria = new CDbCriteria();
        $criteria->select = "service_name";
        $criteria->condition = "service_id='".$record_odr->shop_id."'";
        $record_tpe = CarWashType::model()->find($criteria);

        $criteria = new CDbCriteria();
        $criteria->select = "shop_name";
        $criteria->condition = "shop_id='".$record_odr->shop_id."'";
        $record_shp = ShopInfo::model()->find($criteria);

        $criteria = new CDbCriteria();
        $criteria->condition = "shop_id='".$record_odr->shop_id."' and consume_status=0";
        $record_odrs = CarWashOrderInfo::model()->findAll($criteria);

        if ($record_odr == null || $record_tpe == null || $record_shp == null) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "预约失败!",
                    "data" => array()
                );
        } else {
            $ret_json = array(
                        "status" => 0,
                        "message" => "预约成功!",
                        "data" => array(
                                "status" => 1,
                                "shopname" => $record_shp->shop_name,
                                "ordername" => $record_tpe->service_name,
                                "ordernum" => $order_id,
                                "ordertime" => date('y-m-d',time()),
                                "waiting" => count($record_odrs)-1
                        )
                    );
        }

        return $ret_json;
    }

    public static function modifyArriveTime($order_id, $washing_time){
        $criteria = new CDbCriteria();
        $criteria->condition = "order_id='".$order_id."'";
        $record_odr = CarWashOrderInfo::model()->find($criteria);
        $record_odr->washing_time = $washing_time;
        $is_save = $record_odr->save();
        
        $criteria = new CDbCriteria();
        $criteria->select = "service_name";
        $criteria->condition = "service_id='".$record_odr->shop_id."'";
        $record_tpe = CarWashType::model()->find($criteria);

        $criteria = new CDbCriteria();
        $criteria->select = "shop_name";
        $criteria->condition = "shop_id='".$record_odr->shop_id."'";
        $record_shp = ShopInfo::model()->find($criteria);

        $criteria = new CDbCriteria();
        $criteria->condition = "shop_id='".$record_odr->shop_id."' and consume_status=0";
        $record_odrs = CarWashOrderInfo::model()->findAll($criteria);

        if ($record_odr == null || $record_tpe == null || $record_shp == null || $is_save == false) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "修改预约时间失败!",
                    "data" => array()
                );
        } else {
            $ret_json = array(
                        "status" => 0,
                        "message" => "预约成功!",
                        "data" => array(
                                "status" => 1,
                                "shopname" => $record_shp->shop_name,
                                "ordername" => $record_tpe->service_name,
                                "ordernum" => $order_id,
                                "ordertime" => $washing_time,
                                "waiting" => count($record_odrs)-1
                        )
                    );
        }

        return $ret_json;
    }

    public static function cancelOrder($order_id){
        $criteria = new CDbCriteria();
        $criteria->condition = "order_id='".$order_id."'";
        $record_odr = CarWashOrderInfo::model()->find($criteria);
        if ($record_odr == null) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "订单不存在，取消订单失败!",
                    "data" => array()
            );
            return $ret_json;
        }
        $is_delete = $record_odr->delete();
        
        if ($is_delete == false) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "更新数据库失败，取消订单失败!",
                    "data" => array()
                );
        } else {
            $ret_json = array(
                        "status" => 0,
                        "message" => "取消订单成功!",
                        "data" => array()
            );
        }

        return $ret_json;
    }    
    
    public static function submitReply($user_id, $order_id, $star, $conform_description, $anonymity, $content, $images){
        $ret_json = array(
                    "status" => 0,
                    "message" => "提交订单成功!",
                    "data" => array()
        );
        
        $criteria = new CDbCriteria();
        $criteria->condition = "order_id='".$order_id."'";
        $record_odr = CarWashOrderInfo::model()->find($criteria);
        if ($record_odr == null) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "订单不存在，评价失败!",
                    "data" => array()
            );
            return $ret_json;
        }
        
        $record_odr->reply_status = 1; 
        $record_odr->service_quality = $star;
        $record_odr->description_conform = $conform_description;
        $record_odr->anonymity = $anonymity;
        $record_odr->reply_text = $content;
        $record_odr->reply_image = implode(",", $images);
        $record_odr->reply_time = date('y-m-d h:i:s',time());
        $is_save = $record_odr->save();

        if ($is_save == false) {
            $ret_json = array(
                    "status" => 1,
                    "message" => "更新数据库失败，评价订单失败!",
                    "data" => array()
                );
        } else {
            $ret_json = array(
                        "status" => 0,
                        "message" => "评价成功!",
                        "data" => array()
            );
        }

        return $ret_json;
    }

    public static function getMyReply($user_id){
        $criteria = new CDbCriteria();
        $criteria->condition = "userid='".$user_id."' and reply_status=1";
        $record_odrs = CarWashOrderInfo::model()->findAll($criteria);

        $high_reply = array();
        $medium_reply = array();
        $low_reply = array();
        foreach ($record_odrs as $record_odr) {
           $comments = array(
                "star" => $record_odr->service_quality,
                "content" => $record_odr->reply_text,
                "time" => $record_odr->reply_time
            );

            if ($record_odr->service_quality == 5) {
                 $high_reply[] = $comments;
            } elseif (in_array($record_odr->service_quality, array(3, 4))) {
                $medium_reply[] = $comments;
            } else {
                $low_reply[] = $comments;
            }
        }
        $ret_json = array(
                        "status" => 0,
                        "message" => "评价获取成功!",
                        "data" => array(
                            array(
                                    "type" => "好评",
                                    "count" => count($high_reply),
                                    "comments" => $high_reply
                                ),
                            array(
                                    "type" => "中评",
                                    "count" => count($medium_reply),
                                    "comments" => $medium_reply
                                ),
                            array(
                                    "type" => "差评",
                                    "count" => count($low_reply),
                                    "comments" => $low_reply
                                )
                        )
        );

        return $ret_json;
    }
}
