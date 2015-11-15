<?php
/**
 * SmartyViewRenderer
 * Yii 框架的 Smarty 渲染器, 适用于 Smarty 3
 * 
 * @author yangkuo@baidu.com
 */
class SmartyViewRenderer extends CApplicationComponent implements IViewRenderer
{

    public $fileExtension = '.html';
    public $smartyPath = NULL;
    public $cacheDir = '';
    public $compileDir = '';
    public $templateDir = '';
    public $forceCompile = true;
    public $leftDelimiter = '{';
    public $rightDelimiter = '}';

    private $_smarty;

    public function init()
    {
        parent::init();
        Yii::$classMap['Smarty'] = $this->smartyPath.'/Smarty.class.php';
        Yii::$classMap['Smarty_Internal_Data'] = $this->smartyPath.'/sysplugins/smarty_internal_data.php';
        $this->_smarty = new Smarty();
        $this->_smarty->template_dir = $this->templateDir ? $this->templateDir:Yii::app()->getViewPath(); 
        $this->_smarty->compile_dir = $this->compileDir ? $this->compileDir:Yii::app()->getRuntimePath().'/smarty/compile';
        $this->_smarty->cache_dir = $this->cacheDir ? $this->cacheDir:Yii::app()->getRuntimePath().'/smarty/cache';
        $this->_smarty->left_delimiter = $this->leftDelimiter;
        $this->_smarty->right_delimiter = $this->rightDelimiter;
        $this->_smarty->force_compile = $this->forceCompile;
        Yii::registerAutoloader('smartyAutoload');
    }

    public function renderFile($context, $file, $data, $return)
    {
        $this->_smarty->assign('this', $context);
        if(is_array($data)) {
            foreach ($data as $key => $value) {
                $this->_smarty->assign($key, $value);
            }
        }
        $result = $this->_smarty->fetch($file);
        if ($return) {
            return $result;
        } else {
            echo $result;
        }
    }
}
