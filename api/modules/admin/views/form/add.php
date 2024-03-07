<?php

/* @var $this yii\web\View */
use yii\helpers\Html;
use yii\widgets\Pjax;
use yii\bootstrap\ActiveForm;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;

$this->title = $title;
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-about">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel panel-info coustum-panel">
                <div class="panel-body" style="background-color:#f3d4d463"> 
                   <?php 
                        $form = ActiveForm::begin([					
                            'id' => 'add-question-form',
                            'options' => ['class' => 'form',],
                            'validateOnBlur'=>true,
                            //'enableAjaxValidation'=>true,
                            'enableClientValidation'=>true,
                        ]);
                        echo $form->field($model, 'id')->hiddenInput(['value'=>$model->id,])->label(false)->error(false);
                    ?>
                    <div class="row">
                        <div class="col-md-12 col-xs-12">
                            <?php echo $form->field($model, 'name')?>
                        </div>
                     </div>
                    <div class="row">
                        <div class="col-md-12 col-xs-12">
                            <div id="build-wrap"></div>
                            <!--For loader -->
                            <div id="spinner" class="col-md-12 animated fadeOut" style="position: absolute; top: 0%; opacity: 0.6;padding: 193px;background-color: #fff;display: none;" align="center">
                                <div >
                                    <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                            <!--For loader -->
                        </div>
                     </div>
                    <br>
					<div class="row">
                        <div class="col-md-12">
                            <div class="text-right ">
								
                                <a class="btn btn-danger" href="<?=Yii::$app->request->baseURL?>/admin/form/add">Cancel</a>                             
                                <?php			
                                    echo Html::submitButton(($model->id)?'Update':'Save', ['class' => 'btn btn-success add-question-submit ladda-button', 'name' => 'add-question-submit','data-style'=>'expand-left']);
                                ?> 
                            </div> 
                        </div>                                                            
                    </div>
                    <?php ActiveForm::end(); ?>
                </div>
            </div>
        </div>
    </div>

</div>

<!-- /.content -->
<?php
$this->registerCss('
	.wrap {padding-bottom: 0px !important;}
');

/*$this->registerJsFile(
	Yii::$app->request->baseUrl.'/web/js/form-builder.min.js',
	['depends' => [\app\assets\AppAsset::className()]]
);
$this->registerJsFile(
	Yii::$app->request->baseUrl.'/web/js/form-render.min.js',
	['depends' => [\app\assets\AppAsset::className()]]
);*/
$this->registerJs('
    $("#spinner").show();
    var fbEditor = document.getElementById("build-wrap");
    var options = {
        showActionButtons: false,
        disableFields:[
            "autocomplete",
            "button",
        ],
    };
	var formBuilder = $(fbEditor).formBuilder(options);
	$("#spinner").hide();
	$(function(){
		
		/*document.getElementById("clear-all-fields").onclick = function() {
			formBuilder.actions.clearFields();
		};*/
		$("#add-question-form").on("submit",function(e) {
			e.preventDefault();
		});
		$("#add-question-form" ).on("beforeSubmit", function(event, jqXHR, settings){
			var loading_btn = Ladda.create(document.querySelector(".add-question-submit"));
			var json_data = formBuilder.actions.getData("json", true);
			
			const formData = formBuilder.formData;
			const $markup = $("<div/>");
			$markup.formRender({ formData });
			var html_data = $markup.formRender("html");
			$.ajax({
				type: "POST",
				url: "'.Url::to(['/admin/form/save']).'",				
				data: $(this).serialize() + "&html_data="+ html_data +"&formData=" + formData +"",
				dataType:"json",					
				beforeSend: function(){			
					loading_btn.start();											
				},
				complete: function(){			
					loading_btn.stop();					
				},
				success:function(response){			
					if(response.success){
						//window.location.href = document.URL;
                        parent.postMessage("onSave", "*");
					}
					else if(response.error){
						alert(response.error_msg);
					}	
				}
			});
		});
    });
',
\yii\web\VIEW::POS_END);
