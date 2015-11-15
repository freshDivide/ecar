<?php
/**
 * SystemController is the default controller when access the server
 *
 * @author Ren
 * @date 2015/11/15
*/
class SystemController extends Controller {

    public function filters() {
        return array(
            'auth - error',
            'actionLog',
        );
    }

    public function actionIndex() {
        $this->forward('/user/list');
    }

	public function actionResources() {
        $this->render('list');
	}

    public function actionTemplates() {
        $this->render('templates');
    }

    public function actionCollections() {
        $this->render('collections');
    }


	public function actionForbidden() {
        $this->render('forbidden');
	}

    public function actionLogout() {
        PassportManager::logOut();
	}

    public function actionError() {
        $error=Yii::app()->errorHandler->error;
        $this->render('error', array('error'=>$error));
    }

    public function actionDebug() {
        $this->error('ahhaa');
    }

    public function actionSwitch() {
        $type = $this->getDisplay();
        if($type === 'online') {
            $type = 'offline';
        }
        else {
            $type = 'online';
        }
        $_SESSION['display'] = $type;
        $this->forward('/system/index');
    }

}
