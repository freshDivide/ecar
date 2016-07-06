<?php
/**
 * CarMoveManager
 *
 * @author freshDivide
 * @date 2016/06/18
 */

class CarMoveManager {
    /**
     * get data from CarPlateStyle model
     * @return all sytle_name and sample_img of car license
     */
    public static function getAllRecordCarPlateStyle(){
        $criteria = new CDbCriteria();
        $records = CarPlateStyle::model()->findAll($criteria);

        return $records;
    }

    public static function getAllRecordByPlateStyleIdAndNum($type, $plate_num){
        $criteria = new CDbCriteria();
        $criteria->select = 'style_id';
        $criteria->condition = "style_name = '".$type."'";

        $record = CarPlateStyle::model()->find($criteria);
        if ($record == null){
        	$style_id = 0;
        } else{
        	$style_id = $record->style_id;
        }
        
        $criteria = new CDbCriteria();
        $criteria->condition = "plate_num='".$plate_num."' and plate_style_id=".$style_id;
        $record = CarOwnerInfo::model()->find($criteria);

        return $record;
    }

    public static function getAllRecordAvaliableArea(){
        $criteria = new CDbCriteria();
        $records = CarAvaliableArea::model()->findAll($criteria);

        return $records;
    }

    public static function getAllRecordProtocolInfo(){
        $criteria = new CDbCriteria();
        $criteria->condition = "protocol_name='move_car_protocol'";
        $records = CarProtocolInfo::model()->find($criteria);

        return $records;
    }

    /**
     * 创建一个新的资源
     * @param CarMoveInfo对象,即一条挪车记录
     * @return none 失败抛出异常
     */
    public static function addCarMoveInfo($resource) {
        try {
            $ret = $resource->save();
        } catch (Exception $ex) {
            throw new Exception($ret."添加挪车记录失败".$ex->getMessage());
        }
        return $ret;
    }

    public static function getFirstRecordCarMoveInfo($phone_num) {
        $criteria = new CDbCriteria();
        $criteria->condition = "car_owner_phone='".$phone_num."'";
        $record = CarMoveInfo::model()->find($criteria);
        
        return $record;
    }

    public static function deleteCarMoveInfoRecord($type, $licencePlate, $address){
        $criteria = new CDbCriteria();
        $criteria->select = 'style_id';
        $criteria->condition = "style_name = '".$type."'";

        $record = CarPlateStyle::model()->find($criteria);
        if ($record == null){
            $style_id = 0;
        } else{
            $style_id = $record->style_id;
        }
        
        $criteria = new CDbCriteria();
        $criteria->condition = "plate_num='".$licencePlate."' and style_id=".$style_id." and car_address='".$address."'";
        $record = CarMoveInfo::model()->find($criteria);
        try{
            $ret = $record->delete();
        } catch (Exception $ex){
            $ret = 1;
        }

        return $ret;;
    }
}
