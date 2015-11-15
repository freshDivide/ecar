<?php
/**
 * UserManager
 *
 * @author renbaozhan
 * @date 2014/10/16
 */

class UserManager {
    /**
     * get the resource content by page
     * @return the resource content
     */
    public static function findAll($page_num, $page_size = 10, $condition = "1 = 1", $with = ""){
        $criteria = new CDbCriteria();
        $criteria->limit = $page_size;   //取1条数据，如果小于0，则不作处理
        $criteria->offset = ($page_num - 1) * $page_size;   //两条合并起来，则表示 limit 10 offset1,或者代表了。limit 1,10
        $criteria->order = 't.id DESC' ;//排序条件
        $criteria->condition = $condition;
        $criteria->together = TRUE;
        $criteria->with = $with;
        //$records = User::model()->findAll($criteria);


        $records = User::model()->findAll($criteria);

        return $records;
    }

    /**
     * get user by name
     * @return the check result
     */
    public static function getUserByName($username){
        $criteria = new CDbCriteria();
        $criteria->condition = "name = '".$username."'";;
        $user = User::model()->find($criteria);
        return $user;
    }
    /**
     * get user by name
     * @return the check result
     */
    public static function getUser(){
        $username = $_SESSION['user']['uname'];
        $criteria = new CDbCriteria();
        $criteria->condition = "name = '".$username."'";;
        $user = User::model()->find($criteria);
        return $user;
    }
    /**
     * 创建一个新的资源
     * @param resource 对象
     * @return none 失败抛出异常
     */
    public static function add(&$resource) {
        try {
            $ret = $resource->save();
        } catch (Exception $ex) {
            throw new Exception($ret."添加资源失败".$ex->getMessage());
        }
        return $ret;

    }
    /**
     * 创建一个新的资源
     * @param resource 对象
     * @return none 失败抛出异常
     */
    public static function edit(&$resource) {
        try {
            $ret = $resource->save();
        } catch (Exception $ex) {
            throw new Exception($ret."编辑资源失败".$ex->getMessage());
        }
        return $ret;

    }
    /**
     * delete the resource by id
     * @param resource 对象
     * @return the resource delete result
     */
    public static function delete($resource_id){
        $resource = ResourceManager::findById($resource_id);
        $resource->isDelete = 1;
        try {
            $ret=$resource->update();

        } catch (Exception $ex) {
             throw new Exception($ret."删除资源失败".$ex->getMessage());
        }
        return $ret;
    }

}
