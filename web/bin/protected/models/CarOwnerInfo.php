<?php
/**
 * access CarOwnerInfo model
 *
 * @author freshDivide
 * @date 2016-07-02
*/

class CarOwnerInfo extends RActiveRecord {

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
        return "car_owner_info";
    }
}

?>