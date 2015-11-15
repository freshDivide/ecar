<?php

class DBAConnection extends CDbConnection {

    public $dbaConnections = array();

    public $dbaTimeout = 5;//in seconds

    public function init() {
        $this->setAttribute(PDO::ATTR_TIMEOUT, $this->dbaTimeout);
        parent::init();
    }

    protected function open() {
        if($this->connectionString) {
            return parent::open();
        }

        shuffle($this->dbaConnections);
        $dl = count($this->dbaConnections);
        for($i=0; $i<$dl; $i++) {
            try {
                $this->connectionString = $this->dbaConnections[$i];
                return parent::open();
            } catch(Exception $e) {
                Yii::app()->logging->logDebug('dba连接失败.', array(
                    'connectionString'=>$this->connectionString,
                    'Exception'=>$e->getMessage(),
                ));
                continue;
            }
        }
        throw new CDbException('完了, 数据库连接所有都失败了.');
    }

    /**
	 * Creates a command for execution., 重载Yii的原始方法
	 * @param string SQL statement associated with the new command.
	 * @return CDbCommand the DB command
	 * @throws CException if the connection is not active
	 */
	public function createCommand($sql)
	{
		if($this->getActive())
			return new DBACDbCommand($this,$sql);
		else
			throw new CDbException(Yii::t('yii','CDbConnection is inactive and cannot perform any DB operations.'));
	}
}

