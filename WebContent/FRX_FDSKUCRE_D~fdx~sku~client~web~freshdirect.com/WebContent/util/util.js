jQuery.sap.declare("freshdirect.SKU.util.util");
freshdirect.SKU.util.util = {

	toastMessage: function(message) {
		sap.m.MessageToast.show(message, {
			duration: 60000
		});
	},

	toastMessageAction:function(message,Cntrl){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(message, {
			duration: 60000,
				icon: sap.m.MessageBox.Icon.confirm,
				title: "Conformation",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					if (oAction === "YES") {
						Cntrl.cancelNewSource();
					} else {
					}
				}
			}
		);
	},

	//Function to get selected key's value from dropdown
	getSelectedValue: function(array, key){
		var val = "";
		array.filter(function(obj){
			if(obj.key.toString() === key){
				val = obj.value;
			}
		});
		return val;
	},
	
	//Free text search on Brand 
	onSuggestBrand: function(oEvent,Cntrl) {
		var that = this;
		var aFilters = [],
			sFilter;
		var oInput = oEvent.getSource();
		var sQuery = oInput.getValue();
		var manufaturersData = Cntrl.oDropdownModel.getProperty("/allBrandList");

		if (sQuery && sQuery.length > 0) {
			sFilter = new sap.ui.model.Filter("value", sap.ui.model.FilterOperator.Contains, sQuery);
		}
		aFilters.push(sFilter);

		var binding = oInput.getBinding("suggestionItems");
		binding.filter(aFilters);
	},

	//Free text search on Manufacturer 
	onSuggestMfg: function(oEvent,Cntrl) {
		var that = this;
		var aFilters = [],
			sFilter;
		var oInput = oEvent.getSource();
		var sQuery = oInput.getValue();
		var manufaturersData = Cntrl.oDropdownModel.getProperty("/allManufacturerList");

		if (sQuery && sQuery.length > 0) {
			sFilter = new sap.ui.model.Filter("key", sap.ui.model.FilterOperator.Contains, sQuery);
		}
		aFilters.push(sFilter);

		var binding = oInput.getBinding("suggestionItems");
		binding.filter(aFilters);
	},

	//Free text search on Attribute1
	onSuggestAttribute1: function(oEvent,Cntrl) {
		var that = this;
		var aFilters = [],
			sFilter;
		var oInput = oEvent.getSource();
		var sQuery = oInput.getValue();
		var manufaturersData = Cntrl.oDropdownModel.getProperty("/attribute1");

		if (sQuery && sQuery.length > 0) {
			sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
		}
		aFilters.push(sFilter);

		var binding = oInput.getBinding("suggestionItems");
		binding.filter(aFilters);
	},

	//Free text search on Attribute2
	onSuggestAttribute2: function(oEvent,Cntrl) {
		var that = this;
		var aFilters = [],
			sFilter;
		var oInput = oEvent.getSource();
		var sQuery = oInput.getValue();
		var manufaturersData = Cntrl.oDropdownModel.getProperty("/attribute2");

		if (sQuery && sQuery.length > 0) {
			sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
		}
		aFilters.push(sFilter);

		var binding = oInput.getBinding("suggestionItems");
		binding.filter(aFilters);
	},

	//Free text search on Attribute3
	onSuggestAttribute3: function(oEvent,Cntrl) {
		var that = this;
		var aFilters = [],
			sFilter;
		var oInput = oEvent.getSource();
		var sQuery = oInput.getValue();
		var manufaturersData = Cntrl.oDropdownModel.getProperty("/attribute3");

		if (sQuery && sQuery.length > 0) {
			sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
		}
		aFilters.push(sFilter);

		var binding = oInput.getBinding("suggestionItems");
		binding.filter(aFilters);
	},

	//Free text search on Attribute4
	onSuggestAttribute4: function(oEvent,Cntrl) {
		var that = this;
		var aFilters = [],
			sFilter;
		var oInput = oEvent.getSource();
		var sQuery = oInput.getValue();
		var manufaturersData = Cntrl.oDropdownModel.getProperty("/attribute4");

		if (sQuery && sQuery.length > 0) {
			sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
		}
		aFilters.push(sFilter);

		var binding = oInput.getBinding("suggestionItems");
		binding.filter(aFilters);
	},

	//Function to reset the free text search for Attributes
	clearCategory: function() {
		var oDashboardTabModel = this.oDashboardTabModel;
		oDashboardTabModel.setProperty("/ideationDto/attribute1", "");
		oDashboardTabModel.setProperty("/ideationDto/attribute2", "");
		oDashboardTabModel.setProperty("/ideationDto/attribute3", "");
		oDashboardTabModel.setProperty("/ideationDto/attribute4", "");
	},
	
	//Function to pre-set tab objects for all SKUs
	convertNullObject: function(oResultArry){
		if(oResultArry){
			oResultArry.filter(function(currentSku) {

				if(currentSku){
					//Set null Dto's to object
					if (currentSku.ideationDto === null) { //Ideation tab
						currentSku.ideationDto = {};
					}
					if (currentSku.basicAttributeDto === null) { //Basic Attributes tab
						currentSku.basicAttributeDto = {};
					}
					if (currentSku.binningDto === null) { //Binning tab
						currentSku.binningDto = {};
					}
					if (currentSku.brandOwnerDto === null) { //Brand Owners in Basic Attribute tab
						currentSku.brandOwnerDto = {};
					}
					if (currentSku.commercialFinanceDto === null) { //Commercial Finance tab
						currentSku.commercialFinanceDto = {};
					}
					if (currentSku.dmmDto === null) { //DMM tab
						currentSku.dmmDto = {};
					}
					if (currentSku.merchandisingDto === null) { //Merchandising tab
						currentSku.merchandisingDto = {};
					}
					if (currentSku.productTagsDtos === null) { //Product Tag tab
						currentSku.productTagsDtos = {};
					}
					if (currentSku.storeFrontDto === null) { //Storefront tab
						currentSku.storeFrontDto = {};
						currentSku.storeFrontDto.storeFrontPlacementDtos = [];
					}

					//Set Object to Array conversion
					//Sourcing tab
					var sourceInfoDtos = currentSku.sourceInfoDtos;
					sourceInfoDtos = freshdirect.SKU.formatter.formatter.convertObjectToArray(sourceInfoDtos);
					currentSku.sourceInfoDtos = sourceInfoDtos;

					/*//Merchandising Tab [Forecast Table]
					if (currentSku.hasOwnProperty("merchandisingDto")) {
						this.getPercentForecastDmd(currentSku.merchandisingDto);
					}*/

					//Attachments Tab
					var fileUploadDtos = currentSku.fileUploadDtos;
					fileUploadDtos = freshdirect.SKU.formatter.formatter.convertObjectToArray(fileUploadDtos);
					currentSku.fileUploadDtos = fileUploadDtos;

					//Comments Tab
					var activityLogsDtos = currentSku.activityLogsDtos;
					activityLogsDtos = freshdirect.SKU.formatter.formatter.convertObjectToArray(activityLogsDtos);
					currentSku.activityLogsDtos = activityLogsDtos;
				}
			});
			return oResultArry;
		} else {
			return [];
		}
	},
	
	//Function to check Mandatory Fields are not empty
	checkMandatoryFields: function(Cntrl,manFileds){
		var that = this;
		var oDashboardTabModel = this.oDashboardTabModel;
		manFieldsLen = manFields.length();
		var sPath,value,empFields="",tempArray=[];
		for(var i=0;i<manFieldsLen;i++){
			sPath = manFields[i].sPath;
			value = oDashboardTabModel.getProperty("/sPath");
			if(value ==="" || value === undefined){
				empFields = empFields +" " + manFields[i].fieldName;
			}
		}
		if(empFields!==""){
			var oResourceModel = Cntrl.oResourceModel;
			var errorText = oResourceModel.getText("PLEASE_FILL_THE_FOLLOWING_MANDATORRY_FIELDS")+empFields;
		}
		that.toastMessage(errorText);
		
	},
	
	//Set UI fields Visible on load of dashboard
	setVisiblityOnGetTableData: function(oDashboardVisibilityModel) {
		oDashboardVisibilityModel.setProperty("/createRefernceEnable", false);
		oDashboardVisibilityModel.setProperty("/ideationVisible", true);
		oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
		oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
		oDashboardVisibilityModel.setProperty("/binningVisible", false);
		oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
		oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
		oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
		oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
		oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
		oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
		oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
		oDashboardVisibilityModel.setProperty("/DMMVisible", false);
		oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
		oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
		oDashboardVisibilityModel.setProperty("/cfmVisible", false);
		oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
		oDashboardVisibilityModel.setProperty("/commentsVisible", false);
		oDashboardVisibilityModel.setProperty("/beforeModifyVisible", true);
		oDashboardVisibilityModel.setProperty("/UPCInvalidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCValidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCEachInvalidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCEachValidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCInnerInvalidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCInnerValidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCCaseInvalidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCCaseValidVisiblity", false);
		oDashboardVisibilityModel.setProperty("/sapProdDescEditEnabled", false);
		oDashboardVisibilityModel.setProperty("/UPCNewVisiblity", false);
		oDashboardVisibilityModel.setProperty("/UPCGDSNVisiblity", false);
		oDashboardVisibilityModel.setProperty("/tarActDateEnabled", true);
		oDashboardVisibilityModel.setProperty("/viewSourcesVisible", false);
		oDashboardVisibilityModel.setProperty("/addSourceVisible", true);
		oDashboardVisibilityModel.setProperty("/addDistributerVisible", true);
		oDashboardVisibilityModel.setProperty("/tabVisible", false);
		oDashboardVisibilityModel.setProperty("/loadMoreBtnVisible", true);
		oDashboardVisibilityModel.setProperty("/additionalPlacementAenabled", false);
		oDashboardVisibilityModel.setProperty("/additionalPlacementBenabled", false);
		oDashboardVisibilityModel.setProperty("/additionalPlacementCenabled", false);
		oDashboardVisibilityModel.setProperty("/additionalPlacementDenabled", false);
		oDashboardVisibilityModel.setProperty("/newBrandText", false);
		oDashboardVisibilityModel.setProperty("/isIdeationTier2Editable", false);
		oDashboardVisibilityModel.setProperty("/isIdeationTier3Editable", false);
		oDashboardVisibilityModel.setProperty("/isIdeationTier4Editable", false);
		oDashboardVisibilityModel.setProperty("/reactivationSku", false);
		oDashboardVisibilityModel.setProperty("/wtsnDimsModifyVisible",true);
		oDashboardVisibilityModel.setProperty("/modifyBtnEnabled", false);
		oDashboardVisibilityModel.refresh();
	}
};