<?php
/**
 * SystemController is the default controller when access the server
 *
 * @author
*/
class SystemController extends Controller {

    public function filters() {
        return array(
            'auth - error',
            'actionLog',
        );
    }

    public function actionIndex() {

        echo "Hello World!";


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
