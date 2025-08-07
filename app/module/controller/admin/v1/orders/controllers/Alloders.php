<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

use PhpOffice\PhpSpreadsheet\Helper\Sample;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\RichText\RichText;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Protection;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Worksheet\ColumnDimension;
use PhpOffice\PhpSpreadsheet\Worksheet;


class alloders extends CI_Controller {

	public function  __construct() 
	{ 
		parent:: __construct();
		error_reporting(E_ALL ^ E_NOTICE);  
		error_reporting(0); 
		$this->load->model(array('admin_model','emailtemplate_model','emailsendgrid_model','sms_model','notification_model','order_model'));
		$this->lang->load('statictext', 'admin');
		$this->load->helper('common');
	} 

	/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 + + Function name 	: index
	 + + Developed By 	: DILIP HALDER
	 + + Purpose  		: This function used for index
	 + + Date 			: 07 February 2024
	 + + Updated Date 	: 15 June 2023
	 + + Updated By   	:
	 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	public function index()
	{	
		$this->admin_model->authCheck('view_data');
		$data['error'] 			= '';
		$data['activeMenu'] 	= 'orders';
		$data['activeSubMenu'] 	= 'alloders';

		if($this->input->get('fromDate')):
			$fromDate  = date('Y-m-d H:i', strtotime($this->input->get('fromDate')));
		endif;
		if($this->input->get('toDate')):
			$toDate	   = date('Y-m-d H:i', strtotime($this->input->get('toDate')));
		endif;
		
		$searchField   = $this->input->get('searchField');
		$searchValue   = $this->input->get('searchValue');

		if($searchField && $searchValue):
			$sField			= $this->input->get('searchField');
			$sValue			= $this->input->get('searchValue');
			$whereCon['where'][trim($sField)] = trim($sValue);	
		endif;

		$data['searchField'] 			= $searchField;
		$data['searchValue'] 			= $searchValue;
		$data['fromDate'] 				= $fromDate;  
		$data['toDate'] 				= $toDate;


		// Where conditions section.
		if(!empty($searchField) && !empty($searchValue)):
			if($searchField == 'ticket'):
			 	$whereCon	 = 	array($searchField=> "[[".$searchValue."]]" );
			elseif($searchField == 'order_code'):
				$whereCon		 		= 	array($searchField=>  base64_encode($searchValue));	
			else:
			  	$whereCon[$searchField] =  is_numeric($searchValue)?(int)$searchValue:$searchValue;
			endif;

		else:
			$whereCon['order_status'] = array('$ne' => 'Initialize');
		endif;
		
		$baseUrl 							= 	getCurrentControllerPath('index');
		
		$this->session->set_userdata('ALLORDERSDATA',currentFullUrl());
		$qStringdata						=	explode('?',currentFullUrl());
		$suffix								= 	$qStringdata[1]?'?'.$qStringdata[1]:'';
		
		$url 								= '/v1/admin/orders/list';
		$totalRows  						= $this->common_model->apiDataCount($url,$whereCon);
		// echo "<pre>";print_r($totalRows);die();

		if($this->input->get('showLength') == 'All'):
			$perPage	 					= 	$totalRows;
			$data['perpage'] 				= 	$this->input->get('showLength');  
		elseif($this->input->get('showLength')):
			$perPage	 					= 	$this->input->get('showLength'); 
			$data['perpage'] 				= 	$this->input->get('showLength'); 
		else:
			$perPage	 					= 	SHOW_NO_OF_DATA;
			$data['perpage'] 				= 	SHOW_NO_OF_DATA; 
		endif;

		$uriSegment 						= 	getUrlSegment();
	    $data['PAGINATION']					=	adminPagination($baseUrl,$suffix,$totalRows,$perPage,$uriSegment);

       if($this->uri->segment(getUrlSegment())):
           $page = $this->uri->segment(getUrlSegment());
       else:
           $page = 0;
       endif;
		
		$data['forAction'] 					= 	$baseUrl; 
		if($totalRows):
			$first							=	(int)($page)+1;
			$data['first']					=	$first;
			
			if($data['perpage'] == 'All'):
				$pageData 					=	$totalRows;
			else:
				$pageData 					=	$data['perpage'];
			endif;
			
			$last							=	((int)($page)+$pageData)>$totalRows?$totalRows:((int)($page)+$pageData);
			$data['noOfContent']			=	'Showing '.$first.'-'.$last.' of '.$totalRows.' items';
		else:
			$data['first']					=	1;
			$data['noOfContent']			=	'';
		endif;

		$shortField  = array('_id'=> -1);
		$action 	 = 'multiple';
		$select = array(
	  		// "_id"           =>  true,
	        // "pos_number"    =>  true,
	        // "order_id"      =>  true,
	        // "order_code"    =>  true,
	        // "product_title" =>  true,
	        // "product_qty"   =>  true,
	        // "product_id"    =>  true,
	        // "user_email"    =>  true,
	        // "total_price"   =>  true,
	        // "payment_mode"  =>  true,
	        // "created_at"    =>  true,
	        // "order_status"  =>  true,
	        // "status"        =>  true,
	        // "users_type"    =>  true,
	        // "creation_ip"   =>  true,
	        // "commission_percentage" =>  true,
	        "straight" =>  0,
	        "rumble"   =>  0,
	        "chance"   =>  0,
	        "ticket"   =>  0,
		);

		$data['ALLDATA']    = $this->common_model->apiGetData($action,$url,$whereCon,$shortField,$perPage,$page,$select);	
		// echo "<pre>"; print_r($data['ALLDATA']); die();

		$this->layouts->set_title('Orders | KIWNN');
		$this->layouts->admin_view('orders/alloders/index',array(),$data);
	}	// END OF FUNCTION

	/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 + + Function name : addeditdata
	 + + Developed By  : DILIP HALDER
	 + + Purpose  	   : This function used for Add Edit data
	 + + Date 		   : 07 February 2024
	 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	public function addeditdata($editId='')
	{		
		$data['error'] 			= 	'';
		$data['activeMenu'] 	= 	'orders';
		$data['activeSubMenu'] 	= 	'alloders';
		$this->admin_model->authCheck('view_data');
		
		if($editId):
			$this->admin_model->authCheck('add_data');
			$whereCon['where'][trim('products_id')]  = trim($editId);
			$action 			= 'single';
			$url 				= '/v1/admin/orders/list';
			$data['EDITDATA']   = $this->common_model->apiGetData($action,$url,$whereCon);
			// echo "<pre>";print_r($data);die();
		else:
			redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
		endif;

		$this->layouts->set_title('Orders | KIWNN');
		$this->layouts->admin_view('orders/alloders/addeditdata',array(),$data);
	}	// END OF FUNCTION	

	/***********************************************************************
	** Function name 	: changestatus
	** Developed By 	: DILIP HALDER
	** Purpose  		: This function used for change status
	** Date 			: 07 February 2024
	************************************************************************/
	function changestatus($changeStatusId='',$statusType='')
	{  
		$this->admin_model->authCheck('edit_data');
		$param['status']		=	$statusType;
		$this->common_model->editData('kw_category',$param,'category_id',(int)$changeStatusId);
		$this->session->set_flashdata('alert_success',lang('statussuccess'));
		
		redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
	}

	/***********************************************************************
	** Function name 	: cancelationorder
	** Developed By 	: Dilip Kumar Halder
	** Purpose  		: This function used for order cancelation by admin.
	** Date 			: 05 June 2023
	************************************************************************/
	function cancelationorder($changeStatusId='')
	{  
		
		$this->admin_model->authCheck('edit_data');
		$tblName 				= 'kw_lotto_orders';
		$whereCon['where']		= array('order_id' => $changeStatusId );
		$shortField 			= array('sequence_id' => -1);
		$cancleOrderData 		= $this->common_model->getData('single',$tblName,$whereCon,$shortField,'0','0');

		if($cancleOrderData['status']  == 'CL'):
			$this->session->set_flashdata('alert_error',lang('ALREADY_CANCELLED'));
			redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
		endif;

			//Adding calcelation variable and value.
			$param1['status']			= 'CL';
			$param1['update_ip']		=	currentIp();
			$param1['update_date']		=	(int)$this->timezone->utc_time();//currentDateTime();
			$param1['refund_date']		=	(int)$this->timezone->utc_time();//currentDateTime();
			$param1['updated_by']		=	(int)$this->session->userdata('KW_ADMIN_ID');
			
			// echo "<pre>";print_r($param1);die();
			$this->common_model->editData('kw_lotto_orders',$param1,'order_id',$changeStatusId);

			// Checking Sender User.
			$userid = $cancleOrderData['user_id'];
			
			$tblName 			=   'kw_users';
			$whereCon['where']	=	array('users_id' => $userid , 'status'=> 'A' );
			$shortField 		=   array('users_id' => -1);
			$UserData 			= 	$this->common_model->getData('single',$tblName,$whereCon,$shortField,'0','0');

			// Refund wallet statement Code start here..
			$user_oid 			   					 = $UserData['_id']->{'$id'};
			$commission_amount                       = (float)$cancleOrderData['total_price'];

			$refundparam["load_balance_id"]		     =	(int)$this->common_model->getNextSequence('kw_loadBalance');
			$refundparam["order_oid"] 			     =	new MongoDB\BSON\ObjectId($cancleOrderData['_id']->{'$id'});
			$refundparam["user_oid"] 				 =	new MongoDB\BSON\ObjectId($user_oid);
			$refundparam["user_id_cred"] 			 =	(int)$UserData['users_id'];
			$refundparam["user_id_deb"]			 	 =	(int)0;
			$refundparam["order_id"] 				 =	$cancleOrderData['order_id'];
			$refundparam["upoints"] 				 =	(float)$commission_amount;
			$refundparam["availableArabianPoints"] 	 =	(float)$UserData['availableArabianPoints'];
			$refundparam["end_balance"] 			 =	(float)$UserData['availableArabianPoints'] + (float)$cancleOrderData['total_price'];
		    $refundparam["record_type"] 			 =	'Credit';
		    $refundparam["narration"]				 =	'Order Cancalled';
		    $refundparam["remarks"]				 =	'Ticket ID : '.$cancleOrderData['order_id'];
		    $refundparam["creation_ip"] 			 =	$this->input->ip_address();
		    $refundparam["created_at"] 			 =	date('Y-m-d H:i');
		    $refundparam["created_by"] 			 =	(int)$this->input->get('users_id');
		    $refundparam["status"] 				 =	"A";
		    $this->common_model->addData('kw_loadBalance', $refundparam);

		   	$tblName 			=   'kw_loadBalance';
			$whereCon['where']	=	array('status'=> 'A' , 'narration'=> 'Commission' , 'order_oid' => new MongoDB\BSON\ObjectId($cancleOrderData['_id']->{'$id'}) );
			$commissionList 	= 	$this->common_model->getData('single',$tblName,$whereCon,$shortField);
			$commissionAmount 	= $commissionList['upoints'];
			// Refund wallet statement Code End here..

		    // Commission capturing in order UW_loadbalance table..
		    $commissionParam["load_balance_id"]		 	 =	(int)$this->common_model->getNextSequence('kw_loadBalance');
			$commissionParam["order_oid"] 			 	 =	new MongoDB\BSON\ObjectId($cancleOrderData['_id']->{'$id'});
			$commissionParam["user_oid"] 				 =	new MongoDB\BSON\ObjectId($user_oid);
			$commissionParam["user_id_deb"]			 	 =	(int)$UserData['users_id'];
			$commissionParam["user_id_cred"] 			 =	(int)0;
			$commissionParam["order_id"] 				 =	$cancleOrderData['order_id'];
			$commissionParam["upoints"] 				 =	(float)$commissionAmount;
			$commissionParam["availableArabianPoints"] 	 =	(float)$refundparam["end_balance"];
			$commissionParam["end_balance"] 			 =	(float)$refundparam["end_balance"] - $commissionAmount;
		    $commissionParam["record_type"] 			 =	'Debit';
		    $commissionParam["narration"]				 =	'Commission Reverted';
		    $commissionParam["remarks"]				 	 =	'Ticket ID : '.$cancleOrderData['order_id'];
		    $commissionParam["creation_ip"] 			 =	$this->input->ip_address();
		    $commissionParam["created_at"] 				 =	date('Y-m-d H:i');
		    $commissionParam["created_by"] 			 	 =	(int)$this->input->get('users_id');
		    $commissionParam["status"] 				 	 =	"A";
	    	$this->common_model->addData('kw_loadBalance', $commissionParam);
	    	// Credit the purchesed points and get available arabian points of user.


			// Refunded Sender Cancelation Order Amount.
			if($UserData['availableArabianPoints']):
				$param['availableArabianPoints'] = $commissionParam["end_balance"];
				$this->common_model->editData('kw_users',$param,'users_id',(int)$userid);	
			endif;

			// User detail  used for email and sms  
			// $this->emailsendgrid_model->sendlottoOrderMailToUser($refundparam['order_id']);
			// $this->sms_model->sendLottoTicketDetails($refundparam['order_id']);

		$this->session->set_flashdata('alert_success',lang('ordercenclesuccess'));
		
		redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
	}

	/***********************************************************************
	** Function name 	: deletedata
	** Developed By 	: DILIP HALDER
	** Purpose  		: This function used for delete data
	** Date 			: 07 February 2024
	************************************************************************/
	function deletedata($deleteId='')
	{  
		
		$this->admin_model->authCheck('delete_data');
		$this->common_model->deleteData('kw_category','category_id',(int)$deleteId);
		$this->session->set_flashdata('alert_success',lang('deletesuccess'));
		
		redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
	}

 	/***********************************************************************
	** Function name 	: exportexcel
	** Developed By 	: Dilip halder
	** Purpose  		: This function used for export order data
	** Date 			: 26 January 2024
	************************************************************************/
	function exportexcel()
	{	
		$this->admin_model->authCheck();
		$data['error'] 						= 	'';
		$data['activeMenu'] 				= 	'orders';
		$data['activeSubMenu'] 				= 	'alloders';
		
		// -----------------------------------------------------------------------------//
		if($this->input->post('fromDate')):
			$fromDate	 = date('Y-m-d H:i', strtotime($this->input->post('fromDate')));
		endif;
		if($this->input->post('toDate')):
			$toDate	 	 = date('Y-m-d H:i', strtotime($this->input->post('toDate')));
		endif;

		// -----------------------------------------------------------------------------//
		$searchField = $this->input->post('searchField');
		$searchValue = $this->input->post('searchValue');
		if($searchField == 'status'):
			if($fromDate):
				$whereCon['update_date']['$gte']  =  strtotime($fromDate);
			endif;
			if($toDate):
				$whereCon['update_date']['$lte']  =  strtotime($toDate);
			endif;
		else:
			if($fromDate):
				$whereCon['created_at']['$gte']  =  $fromDate;
			endif;
			if($toDate):
				$whereCon['created_at']['$lte']  =  $toDate;
			endif;
		endif;

		// -----------------------------------------------------------------------------//
		if(!empty($searchField) && !empty($searchValue)):
			
			if($searchField == 'order_code'):
				$whereCon		 	   = 	array($searchField =>  base64_encode($searchValue));	
			elseif($searchField == 'ticket'):
				$whereCon		 	   =  array($searchField => "[[".$searchValue."]]" );	
			else:
				$whereCon[$searchField] =  is_numeric($searchValue)?(int)$searchValue:$searchValue;
			endif;
		else:
			$whereCon['order_status']   = array('$ne' => 'Initialize');
		endif;

		// -----------------------------------------------------------------------------//
		$resultType   = "count";
		$tblName 	  = "kw_lotto_orders";
		$totalRows 	  = $this->common_model->getOrderDetails($resultType,$whereCondition,'','',$tblName);
		 
		$itemsPerPage = 5000;
		// ---------------------------------------------

		$longArray = $totalRows;
		
		$pageno       = $this->input->get('page');
		// Current page number (received from URL query parameter, e.g., ?page=2)
		$page = isset($pageno) ? (int)$pageno : 1;

		// Calculate total number of pages
		$totalPages = ceil($longArray / $itemsPerPage);
		$totalpage= array();
		// Pagination links
		for ($i = 1; $i <= $totalPages; $i++) {
		    if ($i == $page) {
		         $current_page = $i;
		         $totalpage[] = $i;
		    } else {
		         $totalpage[] = $i;
		    }
		}
 		
 		$startIndex  = ($page - 1) * $itemsPerPage;
 		// $resultType  = '';
		// $OrderData 	 = $this->common_model->getOrderDetails($resultType,$whereCondition,$startIndex,$itemsPerPage);
		
		$totalpage 				= count($totalpage);
		$data['current_page']   = $current_page;
		$data['total_page'] 	= $totalpage;
		
		$data['searchField'] 	=   $searchField;
		$data['searchValue'] 	=   $searchValue;
		$data['fromDate'] 		=   $fromDate;
		$data['toDate'] 		=   $toDate;
		// $data['OrderData'] 		= $OrderData?$OrderData:array();

		// echo "<pre>";
		// print_r($data);
		// die();


		// echo "<pre>";print_r($data);die();
		$this->layouts->set_title('Export CSV | KIWNN');
		$this->layouts->admin_view('orders/alloders/exportexcel',array(),$data);
	}	// END OF FUNCTION

	/***********************************************************************
	** Function name 	: exportexcelApi
	** Developed By 	: Dilip halder
	** Purpose  		: This function used for export order data
	** Date 			: 23 July 2024
	************************************************************************/
	function exportexcelApi(){
		
		$this->admin_model->authCheck();
		$data['error'] 						= 	'';
		$data['activeMenu'] 				= 	'orders';
		$data['activeSubMenu'] 				= 	'alloders';
		
		// -----------------------------------------------------------------------------//
		if($this->input->post('fromDate')):
			$fromDate	 = date('Y-m-d H:i', strtotime($this->input->post('fromDate')));
		endif;
		if($this->input->post('toDate')):
			$toDate	 	 = date('Y-m-d H:i', strtotime($this->input->post('toDate')));
		endif;

		// -----------------------------------------------------------------------------//
		$searchField = $this->input->post('searchField');
		$searchValue = $this->input->post('searchValue');
		if($searchField == 'status'):
			if($fromDate):
				$whereCon['update_date']['$gte']  =  strtotime($fromDate);
			endif;
			if($toDate):
				$whereCon['update_date']['$lte']  =  strtotime($toDate);
			endif;
		else:
			if($fromDate):
				$whereCon['created_at']['$gte']  =  $fromDate;
			endif;
			if($toDate):
				$whereCon['created_at']['$lte']  =  $toDate;
			endif;
		endif;

		// -----------------------------------------------------------------------------//
		if(!empty($searchField) && !empty($searchValue)):
			if($searchField == 'order_code'):
				$whereCon		 	   = 	array($searchField =>  base64_encode($searchValue));	
			elseif($searchField == 'ticket'):
				$whereCon		 	   =  array($searchField => "[[".$searchValue."]]" );	
			else:
				$whereCon[$searchField] =  is_numeric($searchValue)?(int)$searchValue:$searchValue;
			endif;
		else:
			$whereCon['order_status']   = array('$ne' => 'Initialize');
		endif;


		// $page = $this->input->post('pageno');
		$page = $this->input->post('pageno');
		// $page = 1;
 		$itemsPerPage = 5000;
 		$startIndex  = ($page - 1)*$itemsPerPage;
 		$resultType  = '';
 		$tblName     = 'kw_lotto_orders';
		$OrderData 	 = $this->common_model->getOrderDetails($resultType,$whereCondition,$startIndex,$itemsPerPage,$tblName);
		


		$CSVData = array();
		foreach($OrderData as $index => $itemsArray):

			if($itemsArray['status'] == "CL"):
				$order_status = 'Cancelled';
			else:
				$order_status = $itemsArray['order_status'];
			endif;

		    $CSVData[$index]['POS No.']            = !empty($itemsArray['pos_number']) ? $itemsArray['pos_number'] : 'N/A';
			$CSVData[$index]['POS Device No.']     = !empty($itemsArray['pos_device_id']) ? $itemsArray['pos_device_id'] : 'N/A';
			$CSVData[$index]['Order ID']           = !empty($itemsArray['order_id']) ? $itemsArray['order_id'] : 'N/A';
			$CSVData[$index]['Product Name']       = !empty($itemsArray['product_name']) ? $itemsArray['product_name'] : 'N/A';
			$CSVData[$index]['Quantity']           = !empty($itemsArray['product_qty']) ? $itemsArray['product_qty'] : 'N/A';
			$CSVData[$index]['Store Name']         = !empty($itemsArray['store_name']) ? $itemsArray['store_name'] : 'N/A';
			$CSVData[$index]['Seller Name']        = !empty($itemsArray['users_name']) ? $itemsArray['users_name'] : 'N/A';
			$CSVData[$index]['Seller Mobile']      = !empty($itemsArray['user_phone']) ? $itemsArray['user_phone'] : 'N/A';
			$CSVData[$index]['Bind With']          = !empty($itemsArray['bindwith_first_name']) ? $itemsArray['bindwith_first_name'] : 'N/A';
			$CSVData[$index]['Purchase Date']      = !empty($itemsArray['created_at']) ? $itemsArray['created_at'] : 'N/A';
			// $CSVData[$index]['Straight Amount']    = !empty($itemsArray['straight_add_on_amount']) ? $itemsArray['straight_add_on_amount'] : 'N/A';
			// $CSVData[$index]['Rumble Amount']      = !empty($itemsArray['rumble_add_on_amount']) ? $itemsArray['rumble_add_on_amount'] : 'N/A';
			// $CSVData[$index]['Chance Amount']      = !empty($itemsArray['reverse_add_on_amount']) ? $itemsArray['reverse_add_on_amount'] : 'N/A';
			$CSVData[$index]['Total Amount']       = !empty($itemsArray['total_price']) ? $itemsArray['total_price'] : 'N/A';
			$CSVData[$index]['Payment Mode']       = !empty($itemsArray['payment_mode']) ? $itemsArray['payment_mode'] : 'N/A';
			$CSVData[$index]['Payment Status']     = !empty($order_status) ? $order_status : 'N/A';
			
		endforeach;

		echo json_encode($CSVData);
		die();
	}

	/***********************************************************************
	** Function name 	: generatecoupons
	** Developed By 	: Dilip halder
	** Purpose  		: This function used for generate coupons from admin panel.
	** Date 			: 20 July 2023
	** Updated Date 	:  
	** Updated By   	:  
	************************************************************************/
	public function generatecoupons()
	{
		$oid = $this->input->post('order_id');
		// $oid = "LZIDN3160191";
		//Get current order of user.
		$wcon['where']					=	[ 'order_id' => $oid ];
		$data['orderData'] 				=	$this->common_model->getData('single', 'kw_lotto_orders', $wcon);
		
		if($data['orderData']['user_id'] === 0):
			$user_phone  =  $data['orderData']['user_phone'];
			// $url = "http://localhost/d-arabia/api/telrOrderSuccess?user_phone=$user_phone&order_id=$oid";
			$url = "https://dealzarabia.com/api/telrOrderSuccess?user_phone=$user_phone&order_id=$oid";
			
		else:
			$users_id  =  $data['orderData']['user_id'];
			$url = "https://dealzarabia.com/api/telrOrderSuccess?users_id=$users_id&order_id=$oid";
			// $url = "http://localhost/d-arabia/api/telrOrderSuccess?users_id=$users_id&order_id=$oid";
		endif;

		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 0,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => 'GET',
			CURLOPT_HTTPHEADER => array(
				'Apikey: c9d58f135dab835ecf44e7c64b978599',
				'Apidate: 2022-06-13',
				'Cookie: ci_session=2t9td2m3ihodk6ptpp5ml3s3vuni65p4; ci_session=r4n3192ojb4ng4mo30m5gdstb4hu5n06; MainLoad=web2|ZLaPN|ZLaPN; MainLoad=web1|ZLkzn|ZLkzj'
			),
		));

		$response = curl_exec($curl);

		curl_close($curl);
		$result = json_decode($response);

		if($result->message == 'Your order placed successfully'):
			$this->session->set_flashdata('alert_success',lang('Coupon_Generaion'));
			redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
		else:
			$this->session->set_flashdata('alert_success',lang('Coupon_Not_Generaion'));
			redirect(correctLink('ALLORDERSDATA',getCurrentControllerPath('index')));
		endif;

	}
}