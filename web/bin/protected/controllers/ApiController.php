<?php
/**
 * apiController contains the systems api for external service
 *
 * @author renbaozhan
 * @date 2015/6/30
*/
class ApiController extends Controller {
    /**
     * get the xml content of  the resource
     * @return the resource xml content
     */
    public function actionGetResourceXml(){
        $id = intval($_GET['id']);
        $data = ResourceManager::findById($id);
        if ($data){
            header('Content-Type: text/xml');
            echo $data->uploaded_xml;
        }else{
            echo '未找到ID为$id的资源';
        }

    }

    /**
     * 提供临时的验证机制, 验证拦截器
     *
     */
    public function filterAuth($filterChain) {
        $filterChain->run();
    }

    /**
     * 默认api不需要验证
     *
     */
    public function filters(){
        return array(
        );
    }

}
