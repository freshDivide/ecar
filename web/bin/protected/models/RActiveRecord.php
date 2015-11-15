<?php

/**
 * RActiveRecord model
 *
 * @author renbaozhan
*/
abstract class RActiveRecord extends CActiveRecord {


    /**
     * 复杂类型字段读取实现
     */
    public function __get($name) {
        if(in_array($name, $this->complexAttributes())) {
            $value = parent::__get($name);
            return CJSON::decode($value);
        } else {
            return parent::__get($name);
        }
    }


    /**
     * 复杂类型字段赋值实现
     */
    public function __set($name, $value) {
        if(in_array($name, $this->complexAttributes())) {
            $value = CJSON::encode($value);
            parent::__set($name, $value);
        } else {
            parent::__set($name, $value);
        }
    }


    /**
     * 用于标记复杂类型字段
     *
     * 用子类覆盖它, 返回一个复杂类型属性名数组.
     * 复杂字段可以用 TEXT 等数据库类型存储, 内部存储格式为JSON.
     * 当给复杂类型字段赋值时, 程序自动将值转化成JSON;
     * 当读取复杂类型字段时, 程序自动将JSON转化成数组.
     *
     * 举例:
     * class SomeModel extends RActiveRecord {
     *     //....
     *     public function complexAttributes() {
     *         return array('complex_attr');
     *     }
     * }
     *
     * 保存时：
     * $obj = new SomeModel();
     * $obj->complex_attr = array('id'=>123, 'name'=>'杨阔');
     * $obj->save();
     *
     * 读取时:
     * $obj = SomeModel::model()->find([...]);
     * print_r($obj->complex_attr);
     *
     * 输出:
     * Array
     * (
     *    [id] => 123
     *    [name] => 杨阔
     * )
     */
    public function complexAttributes() {
        return array();
    }


    /**
     * 可返回复杂类型的 getAttributes()
     *
     */
    public function getComplexAttributes($with = null) {
        $attributes = $this->attributes;

        $complex = $this->complexAttributes();
        foreach($complex as $name) {
            $attributes[$name] = $this->$name;
        }

        if(is_string($with)) {
            $ws = explode(',', $with);
            $relations = array_keys($this->relations());
            foreach($ws as $w) {
                $w = trim($w);
                if(in_array($w, $relations)) {
                    $attr = $this->$w;
                    if($attr === null) {
                        $attributes[$w] = null;
                    } else {
                        $attributes[$w] = $attr->getComplexAttributes();
                    }
                }
            }
        }

        return $attributes;
    }


    public function dump($with = '') {
        return $this->getComplexAttributes($with);
    }


    /**
     * 把当前对象转换成 JSON 格式
     *
     */
    public function json() {
        $attributes = $this->getComplexAttributes();

        $relations = $this->relations();
        foreach($relations as $key=>$val) {
            $rel = $this->$key;
            if(is_array($rel)){
                $attributes[$key] = array();
                foreach($rel as $r) {
                    $attributes[$key][] = $r->getComplexAttributes();
                }
            } else if($rel) {
                $attributes[$key] = $rel->getComplexAttributes();
            } else {
                $attributes[$key] = null;
            }
        }
        return CJSON::encode($attributes);
    }

	/**
	 * 不需要validate的save
	 */
	public function save_2($runValidation=true,$attributes=null) {
		return $this->getIsNewRecord() ? $this->insert($attributes) : $this->update($attributes);
	}

}

?>
