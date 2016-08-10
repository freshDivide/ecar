<?php
/**
 * access CarAvaliableCity model
 *
 * @author freshDivide
 * @date 2016-08-06
*/

class CarAvaliableCity extends RActiveRecord {

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
        return "car_avaliable_city";
    }

    public function relations()
    {
        return array(
            'area'=>array(self::BELONGS_TO, 'CarAvaliableArea', 'city_area_id'),
        );
    }
}

?>