<?php
/**
 * MoveCarController
 *
 * @author freshDivide
 * @date 2016/06/18
*/
date_default_timezone_set('prc');
class MoveCarController extends Controller {

    public function filters() {
        return array(
            'auth - error',
            'actionLog',
        );
    }

	public function actionList() {
        $this->render('list');
	}

    public function actionGetUsers() {
        $keyword = addslashes(trim($_GET['keyword']));
        $condition = "1=1 ";
        if ($keyword) {
            $condition = $condition." and name like '%$keyword%'";
        }
        if (isset($_GET['page_num']) && is_numeric($_GET['page_num'])) {
            $page_num = intval($_GET['page_num']);
        }else{
            $page_num = 1;
        }
        if (isset($_GET['page_size'])  && is_numeric($_GET['page_size'])) {
            $page_size = intval($_GET['page_size']);
        }else{
            $page_size = 10;
        }

        $result = UserManager::findAll($page_num, $page_size, $condition);

        //pagination
        $criteria = new CDbCriteria();
        $criteria->condition = $condition;
        $records = user::model()->findAll($criteria);
        $number = count($records);
        $sum_page = ceil($number / $page_size);
        $result = array(
            'sum_page' => $sum_page,
            'data' => $result,
            'sum_count' => $number
         );
        echo CJSON::encode($result);
    }

    public function actionGetCarPlate() {
        $results = CarMoveManager::getAllRecordCarPlateStyle();
        $car_plate_res = array();
        foreach ($results as $result) {
            $car_plate = array(
                'type' => $result->style_name,
                'imageUrl' => $result->sample_address
            );
            $car_plate_res[] = $car_plate;
        }
    
        echo CJSON::encode($car_plate_res);
    }

    public function actionGetCarOwnerInfo() {
        $type = $_GET['type'];
        $licencePlate = $_GET['licencePlate'];
        $address = $_GET['address'];
        $message = $_GET['message'];

        $result = CarMoveManager::getAllRecordByPlateStyleIdAndNum($type, $licencePlate);
        $car_move_info = new CarMoveinfo;
        $car_move_info->sms_code = '000000';
        $car_move_info->plate_num = $licencePlate;
        $car_move_info->car_address = $address;
        $car_move_info->message = $message;
        $cur_time = date('Y-m-d H:i:s',time());
        $car_move_info->time = date("Y-m-d H:i:s", strtotime($cur_time)); 
        
        if ($result != null){
            $car_move_info->style_id = $result->plate_style_id;
            $car_move_info->car_owner_phone= $result->mobile_phone;
            $car_owner_info = array(
                'status' => 0,
                'message' => '成功获取车主信息,获得对方车主信息',
                'data' => array(
                    array(
                        'name' => $result->name,
                        'mobile_phone' => $result->mobile_phone
                    )
                )
            );
        } else {
            $car_owner_info = array(
                'status' => 1,
                'message' => '数据库中无车主 挪车请求失败',
                'data' => array()
            );
        }

        try{
            $ret = $car_move_info->save();
        } catch (Exception $ex) {
             echo "存储挪车记录失败".$ex->getMessage();
        }
    
        echo CJSON::encode($car_owner_info);
        
    }
    public function actionGetAvaliableArea() {
        $records = CarMoveManager::getAllRecordAvaliableArea();
        if (count($records) != 0){
            $area_data = array();
            foreach ($records as $record) {
                $area_data[] = $record->area_name;
            }
            $result = array(
                'status' => 0,
                'message' => '获取开通地区信息成功！',
                'data' => $area_data
            );
        } else {
            $result = array(
                   'status' => 1,
                   'message' => '数据库中无开通区域信息!',
                   'data' => array()
                );
        }
    
        echo CJSON::encode($result);
    }

    public function actionGetProtocolInfo() {
        $record = CarMoveManager::getAllRecordProtocolInfo();
        if ($record != null){
            $data_protocol = array(
                    'title' => $record->title,
                    'content' => $record->content
                );
            $result = array(
                'status' => 0,
                'message' => '获取挪车协议信息成功！',
                'data' => array($data_protocol)
            );
        } else {
            $result = array(
                   'status' => 1,
                   'message' => '数据库中无挪车协议信息!',
                   'data' => array()
                );
        }
    
        echo CJSON::encode($result);
    }

    public function actionGetSmsCode() {
        $phone_num = $_GET['phone_num'];
        $sms_code = ToolManager::gen_sms_code(6, 1);
        $sms_send_api = 'https://106.ihuyi.com/webservice/sms.php?method=Submit';
        $api_key = '26b83c917f3963660656779b87ebf099';
        $account = 'cf_ecar';
        $post_data = array(
                'account' => $account,
                'password' => $api_key,
                'mobile' => $phone_num,
                'content' => '您的验证码是：'.$sms_code.'。请不要把验证码泄露给其他人。',
            );

        $result = ToolManager::post($sms_send_api, $post_data);
        $result = ToolManager::xml_to_array($result);

        try {
            $status = $result['SubmitResult']['code'];
        } catch (Exception $e) {
            $status = 0;
        }

        if($status == 2){
            $record = CarMoveManager::getFirstRecordCarMoveInfo($phone_num);
            if ($record != null){
                $record->sms_code = $sms_code;
                $record->save();
            }

            $ret_json = array(
                    'status' => 0,
                    'message' => '发送验证码成功',
                    'data' => array(
                            array(
                                'waitTime' => 60
                                )
                        )
            );
        } else {
            $ret_json = array(
                    'status' => 1,
                    'message' => '发送验证码失败',
                    'data' => array()
            );
        }

        echo CJSON::encode($ret_json);
    }

    public function actionGetInputTips() {
        $search_key = $_GET['searchkey'];
        $gaode_input_tips_api = 'http://restapi.amap.com/v3/assistant/inputtips';
        $api_key = '3c11184af876b8ed0c159423e7db3bac';
        $post_data = array(
                'key' => $api_key,
                'keywords' => $search_key,
                'datatype' => 'all'
            );
        try {
            $tips = ToolManager::post($gaode_input_tips_api, $post_data);
            $results = json_decode($tips, true);
            $status = $results['status'];
        } catch (Exception $e) {
            $status = '0';
        }

        if($status == '1'){
            $data_array = array();
            foreach ($results['tips'] as $result) {
                $tip_data['address'] = $result['name'];
                $tip_data['local'] = $result['district'].$result['address'];
                $data_array[] = $tip_data;
            }
            $ret_json = array(
                    'status' => 0,
                    'message' => '输入提示获取成功!',
                    'data' => $data_array
            );
        } else {
            $ret_json = array(
                    'status' => 1,
                    'message' => '输入提示获取失败!',
                    'data' => array()
            );
        }

        echo CJSON::encode($ret_json);
    }

    public function actionGetPoiEncode() {
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $gaode_regeo_api = 'http://restapi.amap.com/v3/geocode/regeo';
        $api_key = '3c11184af876b8ed0c159423e7db3bac';
        $radius = 500;
        $extensions = 'all';
        $batch = false;
        $roadlevel = 1;
        $post_data = array(
                'key' => $api_key,
                'location' => $lat.",".$lon,
                'radius' => $radius,
                'extensions' => $extensions,
                'batch' => $batch,
                'roadlevel' => $roadlevel,
            );
        try {
            $results = ToolManager::post($gaode_regeo_api, $post_data);
            $res_array = json_decode($results, true);
            $status = $res_array['status'];
        } catch (Exception $e) {
            $status = '0';
        }

        if($status == '1'){
            $data_array = array();
            foreach ($res_array['regeocode']['pois'] as $poi) {
                $local_prefix = $res_array['regeocode']['addressComponent']['province'].$res_array['regeocode']['addressComponent']['district'];
                $tip_data['address'] = $poi['name'];
                $tip_data['local'] = $local_prefix.$poi['address'];
                $data_array[] = $tip_data;
            }
            $ret_json = array(
                    'status' => 0,
                    'message' => '输入提示获取成功!',
                    'data' => $data_array
            );
        } else {
            $ret_json = array(
                    'status' => 1,
                    'message' => '输入提示获取失败!',
                    'data' => array()
            );
        }

        echo CJSON::encode($ret_json);
    }

    public function actionPhoneCallRequest() {
        $phone_num = $_GET['phone'];
        $sms_code = $_GET['password'];
        $agree = $_GET['agree'];

        $record = CarMoveManager::getFirstRecordCarMoveInfo($phone_num);
        if ($record != null){
            $sms_code_criterion = $record->sms_code; 
            if ($sms_code == $sms_code_criterion){
                $status = 0;
            } else {
                $status = 1;
            }
        } else {
            $status = 2;
        }

        if($status == 0){
            $ret_json = array(
                    'status' => 0,
                    'message' => '验证码验证成功!',
                    'data' => array(
                            array(
                                'callResult' => 0
                                )
                        )
            );
        } else if ($status == 1){
            $ret_json = array(
                    'status' => 1,
                    'message' => '验证码验证失败!',
                    'data' => array(
                            array(
                                'callResult' => 1
                                )
                        )
            );
        } else {
            $ret_json = array(
                    'status' => 1,
                    'message' => '未向'.$phone_num.'发送过验证码!',
                    'data' => array(
                            array(
                                'callResult' => 2
                                )
                        )
            );

        }

        echo CJSON::encode($ret_json);
    }
}
