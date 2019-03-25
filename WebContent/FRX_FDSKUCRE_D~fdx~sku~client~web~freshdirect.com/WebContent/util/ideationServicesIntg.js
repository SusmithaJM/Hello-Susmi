jQuery.sap.declare("freshdirect.SKU.util.ideationServicesIntg");
freshdirect.SKU.util.ideationServicesIntg = {
		
	//Function to check if entered upc is valid or not
	checkUPCDigitValidation : function(dashboardCntlr){
		var that = this;
		var oResourceModel = dashboardCntlr.oResourceModel;
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var oDashboardVisibilityModel = dashboardCntlr.oDashboardVisibilityModel;
		
		var validUPCMessage = oResourceModel.getText("VALID_UPC");
		var invalidUPCMessage = oResourceModel.getText("INVALID_UPC");
		var referenceGTIN = oDashboardTabModel.getProperty("/ideationDto/referenceGtin");
		referenceGTIN = referenceGTIN.split(" ").join("");
		var sUrl ="/sku/api/validation/GTIN/all/" + referenceGTIN;

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, null, true, "GET", false, false, that.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var oSource = oEvent.getSource();
				var message = oSource.getProperty("/response/message");
				var upcValid = oEvent.getSource().getProperty("/upcvalid");
				var availableInSAP = oEvent.getSource().getProperty("/availableInSAP");
				var availableInGDSN = oEvent.getSource().getProperty("/availableInGDSN");
				var active = oEvent.getSource().getProperty("/active");
				var gtin = oEvent.getSource().getProperty("/gtin");
				var productType = oEvent.getSource().getProperty("/productType");
				
				if(upcValid === false){
					oDashboardTabModel.setProperty("/ideationDto/validGTIN", false);
					oDashboardTabModel.setProperty("/ideationDto/referenceGtin","");
					freshdirect.SKU.util.util.toastMessage(message);
					dashboardCntlr.busy.close();
					return;
				}
				else if(upcValid === true){
					if(availableInSAP === true){
						if(active === true){
							oDashboardTabModel.setProperty("/ideationDto/referenceGtin","");
							freshdirect.SKU.util.util.toastMessage(message);
						} else {
							that.openSelectSkuType(dashboardCntlr);
					    }
					} else if (availableInSAP === false){
						oDashboardTabModel.setProperty("/skuType", "NORMAL_SKU");
					}
					oDashboardTabModel.setProperty("/ideationDto/validGTIN", true);
				}
				
				if(availableInGDSN === true){
					oDashboardVisibilityModel.setProperty("/UPCInvalidVisiblity", false);
					oDashboardVisibilityModel.setProperty("/UPCValidVisiblity", true);
				}else if(availableInGDSN === false){
					oDashboardVisibilityModel.setProperty("/UPCInvalidVisiblity", true);
					oDashboardVisibilityModel.setProperty("/UPCValidVisiblity", false);
				}			
				that.setRefGTINValue(gtin, productType, dashboardCntlr);
				oDashboardVisibilityModel.refresh();
				dashboardCntlr.busy.close();
			} else {
				freshdirect.SKU.util.util.toastMessage("Check digit validation failed");
				dashboardCntlr.busy.close();
			}
		});
		
		oModel.attachRequestFailed(function(oEvent) {
			freshdirect.SKU.util.util.toastMessage("Check digit validation failed");
			dashboardCntlr.busy.close();
		});
	},
	
	//Set Reference GTIN value and Mini Weights Dims Gtin Value
	setRefGTINValue : function(gtin, productType, dashboardCntlr){
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		if(productType === "EA"){
			oDashboardTabModel.setProperty("/ideationDto/gtinEA",gtin);
			oDashboardTabModel.setProperty("/ideationDto/gtinType", "EA");
		} else if(productType === "PK"){
			oDashboardTabModel.setProperty("/ideationDto/gtinIN", gtin);
			oDashboardTabModel.setProperty("/ideationDto/gtinType", "PK");
		} else if(productType === "CS"){
			oDashboardTabModel.setProperty("/ideationDto/gtinCS",gtin);
			oDashboardTabModel.setProperty("/ideationDto/gtinType", "CS");
		}
		oDashboardTabModel.setProperty("/ideationDto/referenceGtin", gtin);
	},
	
	//Open Dialog for Reference GTIN
	openSelectSkuType : function(dashboardCntlr){
		if (!this._refGtinCheckDialog) {
			this._refGtinCheckDialog = sap.ui.xmlfragment("freshdirect.SKU.fragments.refGTINCheck", this);
			dashboardCntlr.getView().addDependent(this._refGtinCheckDialog);
		}
		sap.ui.getCore().byId("refGtinRadioBtnId").setSelectedIndex(-1);
		this._refGtinCheckDialog.open();
	},
	
	//Function to open hierarchies pop
	openHierarchiesPopUp: function(dashboardCntlr){
		var that = dashboardCntlr;
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var oIdeationHierachiesPopUp = dashboardCntlr.oIdeationHierachiesPopUp;
		var refGTIN = "00028400002882";//oDashboardTabModel.getProperty("/ideationDto/referenceGtin");
		var validGTIN = oDashboardTabModel.getProperty("/ideationDto/validGTIN");
		var shortDesc = oDashboardTabModel.getProperty("/ideationDto/sapProductDescription");
		var sUrl = "/sku/api/validation/GTIN/hierarchies/" + refGTIN + "/" +validGTIN;
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, "", true, "GET", false, false, this.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var resultData = oEvent.getSource().getData();
				var materialDetails = resultData.materialDetails;
				oIdeationHierachiesPopUp.setProperty("/gdsnHirachies", materialDetails);
				oIdeationHierachiesPopUp.setProperty("/referenceGTIN", refGTIN);
				oIdeationHierachiesPopUp.setProperty("/shortDescription", shortDesc);
				oIdeationHierachiesPopUp.setProperty("/visibleRowCount", materialDetails.length);
				oIdeationHierachiesPopUp.refresh();
				if (!that.distributorCatalog) {
					that.distributorCatalog = sap.ui.xmlfragment("freshdirect.SKU.fragments.distributorCatalogue", that);
					that.getView().addDependent(that.distributorCatalog);
				}
				that.busy.close();
				that.distributorCatalog.open();
			} else {
				var message = "Error in fetching hierarchies";
				freshdirect.SKU.util.util.toastMessage(message);
			}
		});
		
		oModel.attachRequestFailed(function(oEvent) {
			that.busy.close();
			freshdirect.SKU.util.util.toastMessage("Error in fetching hierarchies");
		});
	},
	
	//Function to Save or Submit or Complete tasks at tab level
	onSaveSubmitCompleteSku: function(dashboardCntlr, sUrl, taskId, saveMode, skuPhase, oGDSNHierarchyDialog){
		var that = this, successMsg, errorMsg, listRequestDto = [];
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var skuData = oDashboardTabModel.getData();
		skuData = this.removeUIFields(skuData, skuPhase, dashboardCntlr);
		skuData.phase = skuPhase;
		if(saveMode === "Task"){
			skuData.mode = "Task";
			skuData.task = taskId; 
			listRequestDto = [skuData];
		} else {
			var oDropdownModel  = dashboardCntlr.oDropdownModel;
			var noOfSkus = oDropdownModel.getProperty("/noOfSkus");
			if(noOfSkus === undefined || noOfSkus === ""){
				noOfSkus = 1;
			} else {
				noOfSkus = parseInt(noOfSkus);
			}
			for(var i=0; i<noOfSkus; i++){
				listRequestDto.push(skuData);
			}
		}
		
		var data = { "listRequestDto": listRequestDto };
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, JSON.stringify(data), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			var message;
			if (oEvent.getParameter("success")) {
				var resultData = oEvent.getSource().getData();
				if(saveMode === "Task"){
					if(resultData.success.length){
						var success = resultData.success[0];
						message = success.message + " for " + success.requestId;
					} else if (resultData.error.length){
						var error = resultData.error[0];
						message = error.message + " for " + error.requestId;
					}
					freshdirect.SKU.util.util.toastMessage(message);
					//Call visibility service
				} else { 
					oDropdownModel.setProperty("/noOfSkus", "1");
					that.showSuccessErrorMsgs(resultData, dashboardCntlr);
					if(oGDSNHierarchyDialog){
						oGDSNHierarchyDialog.close();
					}
				}
			} else {
				if(saveMode === "Task"){
					freshdirect.SKU.util.util.toastMessage("Error updating task");
				} else {
					message = "Error in saving sku";
					freshdirect.SKU.util.util.toastMessage(message);	
				}
			}
			dashboardCntlr.busy.close();
			//dashboardCntlr.loadDashboardData("1");
		});
		oModel.attachRequestFailed(function(oEvent) {
			dashboardCntlr.busy.close();
			freshdirect.SKU.util.util.toastMessage("Error in saving sku");
		});
	},
		
	//Function to show success and error messages on Ideation Save/Submit
	showSuccessErrorMsgs: function(response, dashboardCntlr){
		var oErrArry = response.error;
		var oSuccessArry = response.success;
		var oResponseMsg = oSuccessArry.concat(oErrArry);
		var oSuccessErrorMsgsModel = dashboardCntlr.oSuccessErrorMsgsModel;
		oSuccessErrorMsgsModel.setProperty("/responseMsgs", oResponseMsg);
		oSuccessErrorMsgsModel.setProperty("/visibleRowCount", oResponseMsg.length);
		oSuccessErrorMsgsModel.refresh();
		if (!dashboardCntlr.errorMessgePopUp) {
			dashboardCntlr.errorMessgePopUp = sap.ui.xmlfragment("freshdirect.SKU.fragments.errorMessagePopUp", dashboardCntlr);
			dashboardCntlr.getView().addDependent(this.errorMessgePopUp);
		}
		sap.ui.getCore().byId("MM_SUCCESS_ERROR_TBL").setModel(oSuccessErrorMsgsModel, "oSuccessErrorMsgsModel");
		dashboardCntlr.errorMessgePopUp.open();
	},
	
	//Function to remove fields before posting to service
	removeUIFields: function(data, skuPhase, dashboardCntlr){
		
		var n = {};
		n.projectId = data.projectId;
		n.skuType = data.skuType;
		n.ideationDto = data.ideationDto;
		n.basicAttributeDto = data.basicAttributeDto;
		n.brandOwnerDto = data.brandOwnerDto;
		//n.weightsAndDimsDtos = data.weightsAndDimsDtos;
		n.binningDto = data.binningDto;
		n.merchandisingDto = data.merchandisingDto;
		n.activityLogsDtos = data.activityLogsDtos;
		n.storeFrontDto = data.storeFrontDto;
		n.dmmDto = data.dmmDto;
		n.commercialFinanceDto = data.commercialFinanceDto;
		n.npcDto = data.npcDto;
		n.taskDtos = data.taskDtos;
		
		var oBeforeDeletionWeigtDimsDto = data.beforeDeletionWeigtDimsDto;
		if(oBeforeDeletionWeigtDimsDto){
			n.weightsAndDimsDtos = oBeforeDeletionWeigtDimsDto;
		}else{
			n.weightsAndDimsDtos = data.weightsAndDimsDtos;	
		}
		
		var oBeforeDeletionPrdctSrcDto = data.beforeDeletionPrdctSrcDto;
		if(oBeforeDeletionPrdctSrcDto){
			n.sourceInfoDtos = oBeforeDeletionPrdctSrcDto;
		}else{
			n.sourceInfoDtos = data.sourceInfoDtos;	
		}
		
		
		
		//n.sourceInfoDtos[0].sourceInfoDto = data.sourceInfoDtos[0].sourceInfoDto;
		//n.sourceInfoDtos[0].orderInfoDto = data.sourceInfoDtos[0].orderInfoDto;
		
		//n.brandOwnerDto.isUpdated = true;
		//n.weightsAndDimsDtos.isUpdated = true;
		//n.sourceInfoDtos.isUpdated = true;
		
		//n.sourceInfoDtos[0].sourceInfoDto.isUpdated = true;
		//n.sourceInfoDtos[0].orderInfoDto.isUpdated = true;
		//n.sourceInfoDtos[0].isUpdated = true;
			
		var date = n.ideationDto.targetActivationDate;
		date = new Date(date);
		date = date.getTime();
		n.ideationDto.targetActivationDate = date;
		
		if(skuPhase === "IDEATION"){
			n.phase = "IDEATION"; 
			n.requestId = data.requestId;
			n.ideationDto.requestId = data.requestId;
			//n.ideationDto.isUpdated = true;
		} else if(skuPhase === "FEASIBILITY"){
			n.phase = "FEASIBILITY"; 
			n.requestId = data.requestId;
			n.ideationDto.requestId = data.requestId;
		} else if(skuPhase === "COMMERCIALIZATION"){
			n.phase = "COMMERCIALIZATION"; 
		}
		return n;

	/*	if(data){
			var ideationDto = data.ideationDto;
			if(ideationDto){
				if(ideationDto.hasOwnProperty("isUpdated")){
					ideationDto.isUpdated = true;
				}
				var date = ideationDto.targetActivationDate;
				date = new Date(date);
				date = date.getTime();
				ideationDto.targetActivationDate = date;
			}
			if(basicAttributeDto){
				if(basicAttributeDto.hasOwnProperty("isUpdated")){
					basicAttributeDto.isUpdated = true;
				}
			}
			
		}
		delete data.key;
		delete data.copyOverVisible;
		
		if(skuPhase === "IDEATION"){
			data.phase = "IDEATION"; 
		} else if(skuPhase === "FEASIBILITY"){
			data.phase = "FEASIBILITY"; 
		} else if(skuPhase === "COMMERCIALIZATION"){
			data.phase = "COMMERCIALIZATION"; 
		}
		return data;*/
	}
};