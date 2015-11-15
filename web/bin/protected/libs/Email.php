<?php

/********************************************************************************
*  this can be used to send the mine type mail. 
*
*  usage:
*  sendEmail("qipeng@baidu.com,qipeng@baidu.com","title","content<br>OK","Aladdin");
********************************************************************************/

/**
*发送邮件类
*封装了htmlMimeMail5
*/
class Email
{
    /**
    *构造函数
    *导入原始类
    */
	public function __construct()
	{
		require_once('email/htmlMimeMail5.php');
	}

    /**
    *发送邮件
    *
    *@param   string  发送邮箱地址
    *@param   array   接收邮箱地址
    *@param   array   抄送人
    *@param   string  邮件标题
    *@param   string  邮件内容
    *@param   array   文件附件，地址格式
    *@param   string  编码格式
    */
	public function send($from, $to, $cc = '', $subject, $content='',  $files='', $char='utf-8')
	{
		$site_email = new htmlMimeMail5();
		$site_email->setHeadCharset($char);
		$site_email->setTextCharset($char);
		$site_email->setHtmlCharset($char);
		$site_email->setFrom($from);
		$site_email->setSubject($subject);
		$site_email->setHTML($content);
        $site_email->setCc($cc);
        $address = explode(",",$to);
        if ($files  != '')
        {
            foreach($files as $file)
            {
                if(file_exists($file))
                {
                    $attachment = new fileAttachment($file);
                    $site_email->addAttachment($attachment);
                }
                else
                {
                    $this->logger->write_log('ERROR', 'MAIL: attachment '.$file.' not exists');
                }
            }
        }
	
        foreach($address as $k)
        {
            $mail[$k]   = 1;
        }
        foreach($mail as $k => $v)
        {
            $address_new[]  = $k;
        }
    
		if($site_email->send($address_new))
        {
            return true;
		}
		else
        {
            return false;
		}
    }
}
