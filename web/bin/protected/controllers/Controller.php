<?php
/**
 * A super class using as a controller to do the cas, uic, uacs work before login to the server
 *
 * @author
*/
class Controller extends CController {

    private $_tpl = null;
    private $_user = null;
    private $_userRemote = null;



    /**
     * 检查读写权限,暂时做简单的一版
	 * @param string
	 * @param array
	 * @return bool
     */
    public function checkAccess($route , $action_params) {
        return true;
    }

    /**
     * 提供临时的验证机制, 验证拦截器
     *
     */
    public function filterAuth($filterChain) {

        Yii::app()->session->open();
        $filterChain->run();

    }


    /**
     * 操作日志拦截器
     *
     */
    public function filterActionLog($filterChain) {
        $uri = Yii::app()->getRequest()->getRequestUri();
        $user_agent = Yii::app()->getRequest()->userAgent;
        $referer = Yii::app()->getRequest()->urlReferrer;
        $filterChain->run();
    }


    /**
     * 管理员
     *
     */
    public function filterAdmin($filterChain) {
        $filterChain->run();
    }


    /**
     * 默认所有action都加入验证
     *
     */
    public function filters(){
        return array(
            'auth',
        );
    }

}
