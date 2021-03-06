<?php
/**
 * access CarAvaliableArea model
 *
 * @author freshDivide
 * @date 2016-07-03
*/

class CarAvaliableArea extends RActiveRecord {

    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * 定义数据表关系
     */
    // public function relations() {
    //     return array(
    //         'role' => array(self::BELONGS_TO, 'Role', 'role_id'),
    //     );
    // }

    public function tableName()
    {
        return "car_avaliable_area";
    }

    public function relations()
    {
        return array(
            'area_city'=>array(self::HAS_MANY, 'CarAvaliableCity', 'city_area_id'),
        );
    }
}

?>