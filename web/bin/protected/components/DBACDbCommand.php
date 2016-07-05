<?php
/**
 * 提供DBA重试功能,重载原有的Yii类
 * @author zhouhongwei
 */
class DBACDbCommand extends CDbCommand
{
    public $bind_values = array() ;
    public $bind_params = array();

    /**
     * 重载bindValue,记录绑定的值
     */
    public function bindValue($name, $value, $dataType=null) {
        $tmp = array($name, $value, $dataType);
        array_push($this->bind_values, $tmp);
        return parent::bindValue($name, $value, $dataType);
    }

    /**
     * 重载bindParam,记录绑定的值
     */
    public function bindParam($name, &$value, $dataType=null, $length=null){
        $tmp = array($name, $value, $dataType, $length);
        array_push($this->bind_params, $tmp);
        return parent::bindParam($name, $value, $dataType, $length);
    }

    /**
     * 重载execute, 如果不是事务并且出现连接失败的错误，就进行重试,最多重试3次
     */
    public function execute($params=array()) {
        return $this->operateDB(array(get_parent_class($this),"execute"), $params);
    }

    /**
     * 重载query, 如果不是事务并且出现连接失败的错误，就进行重试,最多重试3次
     */
    public function query($params=array()) {
        return $this->operateDB(array(get_parent_class($this),"query"), $params=array());
    }

    /**
     * 重载queryAll, 如果不是事务并且出现连接失败的错误，就进行重试,最多重试3次
     */
    public function queryAll($fetchAssociative=true,$params=array()) {
        return $this->operateDB(array(get_parent_class($this),"queryAll"), array($fetchAssociative,$params));
    }

    /**
     * 重载queryRow, 如果不是事务并且出现连接失败的错误，就进行重试,最多重试3次
     */
    public function queryRow($fetchAssociative=true,$params=array()) {
        return $this->operateDB(array(get_parent_class($this),"queryRow"), array($fetchAssociative,$params));
    }

    /**
     * 重载queryScalar, 如果不是事务并且出现连接失败的错误，就进行重试,最多重试3次
     */
    public function queryScalar($params=array()) {
        return $this->operateDB(array(get_parent_class($this),"queryScalar"), $params);
    }

    /**
     * 重载eryColumn, 如果不是事务并且出现连接失败的错误，就进行重试,最多重试3次
     */
    public function queryColumn($params=array()) {
        return $this->operateDB(array(get_parent_class($this),"queryColumn"), $params);
    }
	
	/**
	 * 打上标签，未了数据库的安全日志
	 */
	public function setText($value) {
		$value .= ' /* mis-data-stream-secure-tag */';
		return parent::setText($value);
	}

    /**
     * 数据库读写操作，如果数据库连接丢失，提供重试机制
     * @param db_operation 回调方法
     * @param params 回调方法参数
     * @param try_times 重试次数
     * @return 失败则抛出异常
     */
    private function operateDB($db_operation,$params,$try_times = 0) {	
        $conn = $this->getConnection();
        $transaction = $conn->getCurrentTransaction();
        if($transaction && $transaction->getActive() === true) {
            return call_user_func_array($db_operation, $params);
        }
        try{
            //回调数据库操作
            $try_times ++;
            return call_user_func_array($db_operation, $params);
        }
        catch(Exception $ex) {
            //如果重试超过3次，退出
            if($try_times > 3) {
                throw $ex;
            }
            //如果是数据库连接丢失
            $error_msg = $ex->getMessage();
            if(strstr($error_msg, "MySQL server has gone away") 
			|| strstr($error_msg, 'can"t connect to db server')
			|| strstr($error_msg, 'Lost connection to MySQL server during query')) {
                //重新选择可用连接
                Yii::app()->db->setActive(false); 
                Yii::app()->db->connectionString = NULL;
                Yii::app()->db->setActive(true);
                //是否需要重新bindValue和bindParam
                if($this->getPdoStatement() instanceof PDOStatement) {
					
                    $this->setText($this->getText());
                    $this->prepare();
                    foreach($this->bind_values as $bind_value) {
                        call_user_func_array(array(&$this,"bindValue"), $bind_value);
                    }
                    foreach($this->bind_params as $bind_param) {
                        call_user_func_array(array(&$this,"bindParam"), $bind_param);
                    }
                    $this->bind_values = array();
                    $this->bind_params = array();
                }

                //重新操作
                return $this->operateDB($db_operation, $params, $try_times);
            }
            else {
                throw $ex;
            }
        }
    }


}
