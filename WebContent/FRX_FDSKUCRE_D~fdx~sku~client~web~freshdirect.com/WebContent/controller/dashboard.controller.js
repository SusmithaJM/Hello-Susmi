sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"freshdirect/SKU/formatter/formatter",
	"sap/m/BusyDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"freshdirect/SKU/util/util",
	"freshdirect/SKU/util/dropdownServices",
	"freshdirect/SKU/util/ideationServicesIntg"
], function(Controller, formatter, BusyDialog, Filter, FilterOperator, util, dropdownServices, IdeationServices) {
	"use strict";

	return Controller.extend("freshdirect.SKU.controller.dashboard", {

		/* Below are the module names named by IDs, for the ease of search . . 
			01. DASHBOARD_TABLE
			02. CREATE/REFERENCE_SKU 
			03. MODIFY_SKU
			04. EXPORT
			05. FITLERS_SORTERS
			06. DOWNLOAD_TEMPLATES
			07. UPLOAD_DOC
			08. DROPDOWN_NAV
			09. DASHBOARD_TAB_LAY
			10. IDEATION_TAB
			11. BASIC_ATTRIUTES_TAB 
			12. WTS_DIMS_TAB
			13. BINNING_TAB
			14. PRODUCT_SOURCE_TAB
			    14.1. SOURCING_TAB
			    14.2. VIEW_SOURCE_TABLE
			    14.3. SOURCE_INFO_DETAIL_PANEL
			    14.4. ORDERING_INFO_PANEL
			    14.5. COSTSHEET_PANEL
			15. DMM_TAB
			16. MERCHANDISING_TAB
			17. STORE_FRONT_TAB 
			18. PRODUCT_TAGS_TAB
			19. CFM_TAB
			20. ATTCHMENT_TAG
			21. COMMENTS_TAG
			22. TASK_SERVICE_INTG
		. . */

		/**
		 * Called when a controller is in stantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf freshdirect.SKU.view.dashboard
		 */
		onInit: function() {

			var that = this;
			this.init = true;
			this.busy = new BusyDialog();
			this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};
			this.autoTblRowSelection = false; //Value to know if the table row is user selected or fireChanged

			var oDashboardTableModel = this.getOwnerComponent().getModel('oDashboardTableModel');
			this.oDashboardTableModel = oDashboardTableModel;

			var oDashboardVisibilityModel = this.getOwnerComponent().getModel('oDashboardVisibilityModel');
			this.oDashboardVisibilityModel = oDashboardVisibilityModel;
			oDashboardVisibilityModel.setProperty("/tabVisible", false);
			
			oDashboardVisibilityModel.setProperty("/costsheetToolBarBoxWidth", "24.8%");

			var tempModel = this.getOwnerComponent().getModel('tempModel');
			this.tempModel = tempModel;

			this._router = sap.ui.core.UIComponent.getRouterFor(this);
			this._router.attachRoutePatternMatched(function(oEvent) {
				var viewName = oEvent.getParameter("name");
				if (viewName === "dashboard") {
					that.routePatternMatched(oEvent);
					that.loadDashboardData("1");
					return new Promise(function(resolve, reject) {
						dropdownServices.setDropdownData(that);
					});
				}
			});
		},

		routePatternMatched: function(oEvent) {
			var oDataModel = this.getOwnerComponent().getModel('oDataModel');
			this.oDataModel = oDataModel;

			var oVendorLookupModel = this.getOwnerComponent().getModel('oVendorLookupModel');
			this.oVendorLookupModel = oVendorLookupModel;
			
			var oDashboardTabModel = this.getOwnerComponent().getModel('oDashboardTabModel');
			this.oDashboardTabModel = oDashboardTabModel;

			var oDropdownModel = this.getOwnerComponent().getModel('oDropdownModel');
			this.oDropdownModel = oDropdownModel;
			oDropdownModel.setSizeLimit(10000);

			var oResourceModel = this.getOwnerComponent().getModel('i18n');
			this.oResourceModel = oResourceModel.getResourceBundle();

			var oGDSNDetailsModel = this.getOwnerComponent().getModel('oGDSNDetailsModel');
			this.oGDSNDetailsModel = oGDSNDetailsModel; //Model holding gdsn service details

			var skuTempObjectModel = this.getOwnerComponent().getModel('skuTempObjectModel');
			this.skuTempObjectModel = skuTempObjectModel;

			var oUploadModel = this.getOwnerComponent().getModel('oUploadModel');
			this.oUploadModel = oUploadModel;

			var oMerchandisingModel = this.getOwnerComponent().getModel('oMerchandisingModel');
			this.oMerchandisingModel = oMerchandisingModel;

			var oUPCCheckModel = this.getOwnerComponent().getModel('oUPCCheckModel');
			this.oUPCCheckModel = oUPCCheckModel;

			var oPaginationModel = this.getOwnerComponent().getModel('oPaginationModel');
			this.oPaginationModel = oPaginationModel;

			var oDashboardModifyModel = this.getOwnerComponent().getModel('oDashboardModifyModel');
			this.oDashboardModifyModel = oDashboardModifyModel;
			oDashboardModifyModel.setProperty("/indices", []);

			//This Model is Used only for Weights & Dims Properties
			var oWeightDimsVisibleModel = this.getOwnerComponent().getModel('oWeightDimsVisibleModel');
			this.oWeightDimsVisibleModel = oWeightDimsVisibleModel;

			var skuTempObjectModel = this.getOwnerComponent().getModel('skuTempObjectModel');
			this.skuTempObjectModel = skuTempObjectModel;
			
			////This Model is Used only for CFM tab values and Properties
			var oCFMValuesModel = this.getOwnerComponent().getModel('oCFMValuesModel');
			this.oCFMValuesModel = oCFMValuesModel;
			
			var oIdeationHierachiesPopUp = this.getOwnerComponent().getModel('oIdeationHierachiesPopUp');
			this.oIdeationHierachiesPopUp = oIdeationHierachiesPopUp;
			
			var oSuccessErrorMsgsModel = this.getOwnerComponent().getModel('oSuccessErrorMsgsModel');
			this.oSuccessErrorMsgsModel = oSuccessErrorMsgsModel;
			
			var oWeightsNDimsModel = this.getOwnerComponent().getModel('oWeightsNDimsModel');
			this.oWeightsNDimsModel = oWeightsNDimsModel;
		},
		
		//Function to load all fragments for Icon Tab bar layout
		loadIconTabLayFragments: function() {

			var oIconTabLayout = this.getView().byId("iconTabId");
			//Ideation
			if (!this.oIdeation) {
				this.oIdeation = sap.ui.xmlfragment("freshdirect.SKU.fragments.ideation", this);
			}
			var ideationLay = new sap.m.IconTabFilter({
				content: this.oIdeation,
				tooltip: "{i18n>IDEATION}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/Ideation/visible}",
				key: "01",
				text: "{i18n>IDEATION_TAB}"
			});
			oIconTabLayout.addItem(ideationLay);

			//Basic Attributes
			if (!this.oBasicAttributes) {
				this.oBasicAttributes = sap.ui.xmlfragment("freshdirect.SKU.fragments.basicAttributes", this);
			}
			var basicAttrLay = new sap.m.IconTabFilter({
				content: this.oBasicAttributes,
				tooltip: "{i18n>BASIC_PRODUCT_ATTRIBUTE}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/BasicProductAttributes/visible}",
				key: "02",
				text: "{i18n>BASIC_PRODUCT_ATTRIBUTE}"
			});
			oIconTabLayout.addItem(basicAttrLay);

			//Weights and Dims
			if (!this.weightsDims) {
				this.weightsDims = sap.ui.xmlfragment("freshdirect.SKU.fragments.weightsDims", this);
			}
			var weightsDims = new sap.m.IconTabFilter({
				content: this.weightsDims,
				tooltip: "{i18n>WEIGHT_DIMS}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/weightsandDims/visible}",
				key: "12",
				text: "{i18n>WEIGHT_DIMS}"
			});
			oIconTabLayout.addItem(weightsDims);

			//Binning
			if (!this.binning) {
				this.binning = sap.ui.xmlfragment("freshdirect.SKU.fragments.binning", this);
			}
			var binning = new sap.m.IconTabFilter({
				content: this.binning,
				tooltip: "{i18n>BINNING}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/Binning/visible}",
				key: "03",
				text: "{i18n>BINNING}"
			});
			oIconTabLayout.addItem(binning);

			//Sourcing
			if (!this.sourcing) {
				this.sourcing = sap.ui.xmlfragment("freshdirect.SKU.fragments.sourcing", this);
			}
			var sourcing = new sap.m.IconTabFilter({
				content: this.sourcing,
				tooltip: "{i18n>PRODUCT_SOURCE}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/ProductSources/visible}",
				key: "04",
				text: "{i18n>PRODUCT_SOURCE}"
			});
			oIconTabLayout.addItem(sourcing);

			//DMM
			if (!this.dmm) {
				this.dmm = sap.ui.xmlfragment("freshdirect.SKU.fragments.dmm", this);
			}
			var dmm = new sap.m.IconTabFilter({
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/DMM/visible}",
				content: this.dmm,
				tooltip: "{i18n>DMM}",
				key: "05",
				text: "{i18n>DMM}"
			});
			oIconTabLayout.addItem(dmm);

			//Merchandising
			if (!this.merchandising) {
				this.merchandising = sap.ui.xmlfragment("freshdirect.SKU.fragments.merchandizing", this);
			}
			var merchandising = new sap.m.IconTabFilter({
				content: this.merchandising,
				tooltip: "{i18n>MERCHANDISING}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/Merchandising/visible}",
				key: "06",
				text: "{i18n>MERCHANDISING}"
			});
			oIconTabLayout.addItem(merchandising);

			//StoreFront
			if (!this.storeFront) {
				this.storeFront = sap.ui.xmlfragment("freshdirect.SKU.fragments.storeFront", this);
			}
			var storeFront = new sap.m.IconTabFilter({
				content: this.storeFront,
				tooltip: "{i18n>STORE_FRONT_ATTRIBUTES}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/StoreFrontAttributes/visible}",
				key: "07",
				text: "{i18n>STORE_FRONT_ATTRIBUTES}"
			});
			oIconTabLayout.addItem(storeFront);

			//Commercial Finance
			if (!this.commercialFinance) {
				this.commercialFinance = sap.ui.xmlfragment("freshdirect.SKU.fragments.commercialFinance", this);
			}
			var commercialFinance = new sap.m.IconTabFilter({
				content: this.commercialFinance,
				tooltip: "{i18n>COMMERCIAL_FINANCE}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/CommercialFinance/visible}",
				key: "09",
				text: "{i18n>COMMERCIAL_FINANCE}"
			});
			oIconTabLayout.addItem(commercialFinance);

			//Attachments
			if (!this.attachments) {
				this.attachments = sap.ui.xmlfragment("freshdirect.SKU.fragments.attachments", this);
			}
			var attachments = new sap.m.IconTabFilter({
				content: this.attachments,
				tooltip: "{i18n>ATTACHMENTS}",
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/Attachments/visible}",
				key: "10",
				text: "{i18n>ATTACHMENTS}"
			});
			oIconTabLayout.addItem(attachments);

			//Attachments
			if (!this.comments) {
				this.comments = sap.ui.xmlfragment("freshdirect.SKU.fragments.comments", this);
			}
			var comments = new sap.m.IconTabFilter({
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/comments/visible}",
				content: this.comments,
				tooltip: "{i18n>COMMENTS}",
				key: "11",
				text: "{i18n>COMMENTS}"
			});
			oIconTabLayout.addItem(comments);
			
			//NPC
			if (!this.npc) {
				this.npc = sap.ui.xmlfragment("freshdirect.SKU.fragments.npc", this);
			}
			var npc = new sap.m.IconTabFilter({
				visible: "{oDashboardVisibilityModel>/tabVisibility/tabs/npc/visible}",
				content: this.npc,
				tooltip: "{i18n>NPC}",
				key: "13",
				text: "{i18n>NPC}"
			});
			oIconTabLayout.addItem(npc);
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DASHBOARD_TABLE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Dash board Table service integration
		loadDashboardData: function(val) {
			var that = this;
			this.busy.open();
			var sUrl = "/sku/api/request/read/" + val + "/";
			var oDashboardTableModel = this.oDashboardTableModel;
			var oPaginationModel = this.oPaginationModel;
			var oDropdownModel = this.oDropdownModel;

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify({}), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oEvent.getSource().getData();
					var data = oDashboardTableModel.getData();
					var dataList = data.listRequestDto;
					var resultList = resultData.listRequestDto;
					if (val > 1) {
						resultList = dataList.concat(resultList);
					}
					util.convertNullObject(resultList);
					resultData.listRequestDto = resultList;
					oDashboardTableModel.setData(resultData);
					oDashboardTableModel.setProperty("/tempArray", []);
					
					var oDashboardVisibilityModel = that.oDashboardVisibilityModel;
					util.setVisiblityOnGetTableData(oDashboardVisibilityModel);
					oDashboardVisibilityModel.refresh();

					var oDashboardTabModel = that.oDashboardTabModel;
					if (!oDashboardTabModel.getData().ideationDto) {
						oDashboardTabModel.getData().ideationDto = {};
					}

					var tempModel = that.tempModel;
					var data = oEvent.getSource().getData();
					tempModel.setData(jQuery.extend(true, [], data));
					tempModel.refresh();
					oPaginationModel.setProperty("/dashboardPage", val);
					oDropdownModel.setProperty("/selectKey","2");
					
					var oDashboardTabModel = that.oDashboardTabModel;
					var skuTempObjectModel = that.skuTempObjectModel;
					var oTempObj = skuTempObjectModel.getData();
					oDashboardTabModel.setData(oTempObj);
					
					//that.getView().byId("SKU_DASHBOARD_TABLE").clearSelection();
				} else {
					var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
					util.toastMessage(errorText);
				}
				that.busy.close();
			});

			oModel.attachRequestFailed(function(oEvent) {
				that.busy.close();
				var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				util.toastMessage(errorText);
			});
		},

		
		//Function to clear dashboard table filters
		onClearFilter: function(oEvent) {
			var oTable = this.getView().byId("SKU_DASHBOARD_TABLE");
			var columns = oTable.getColumns();
			var i;
			var columnsLen = columns.length;
			for (i = 0; i < columnsLen; i++) {
				oTable.filter(columns[i], null);
			}
		},

		onFilterColumn: function(oEvent) {

		},

		//On selecting dashboard table rows
		onDashboardTblRowSelect: function(oEvent) {
			var that = this;
			if(this.autoTblRowSelection === true){
				this.autoTblRowSelection = false;
				return;
			}
			this.busy.open();
			var oSource = oEvent.getSource();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;

			if (oEvent.getParameters().rowContext != null) {
				var sPath = oEvent.getParameter("rowContext").getPath().split("/")[2];
				var indices = oDashboardModifyModel.getProperty("/indices");
				var value = indices.indexOf(parseInt(sPath));
				if (value === -1) {
					indices.push(parseInt(sPath));
				} else {
					indices.splice(value, 1);
				}

				var selectedIndices = oDashboardModifyModel.getProperty("/indices");
				if (selectedIndices.length === 1 || selectedIndices.length === '1') {
					oDashboardVisibilityModel.setProperty("/createRefernceEnable", true);
					oDashboardVisibilityModel.setProperty("/modifyBtnEnabled", true);
					var selectedSKU = oEvent.getParameter("rowContext").getPath();
					var oDashboardTableModel = this.oDashboardTableModel;
					var getSelectedSKUDetails = oDashboardTableModel.getProperty(selectedSKU);
					oDashboardTabModel.setData(getSelectedSKUDetails);
					oDashboardVisibilityModel.setProperty("/tabVisible", true);
					oDashboardVisibilityModel.setProperty("/selTabKey", "01");
					oDashboardVisibilityModel.setProperty("/newMFGText", false);
					
					//this.isDashboardTabLayoutEditableVisible(); //Set Visible Tab and Editable field of IconBar
					this.setBinningTabLayoutData();
					this.onChangeBinningMinOrder();

					//Merchandising Tab [Forecast Table]
					if (getSelectedSKUDetails.hasOwnProperty("merchandisingDto")) {
						this.getPercentForecastDmd(getSelectedSKUDetails.merchandisingDto);
					}
					this.setHierarchiesLevel(); //added by nidhi to set Hierarchy value in Weight&Dims
					this.setVisibilityOfWTSDIMTableColmn(); //set visibility of weights & Dim Tab Table Column on load
					this.createHierarchiesObj();
					
					this.setCFMTabValue();
					this.fireChangeTiers();
					dropdownServices.getMerchantAttributes(this);
				
					var oDropdownModel = this.oDropdownModel;
					oDropdownModel.setProperty("/selectChangeUnitKey", "ALL");
					oDropdownModel.setProperty("/previousButtonEnabled", false);
					oDropdownModel.setProperty("/nextButtonEnabled", true);
					that.getSelectedSKUTabVisiblity();
				} else {
					//oDashboardTabModel.setData(""); 
					oDashboardVisibilityModel.setProperty("/tabVisible", false);
//					oDashboardVisibilityModel.setProperty("/modifyBtnEnabled", false);
					oDashboardVisibilityModel.setProperty("/createRefernceEnable", false);
				}
			}
			this.busy.close();
		},
		
		//Function to pre-set tiers and attributes
		fireChangeTiers: function(){
			var oDashboardTabModel = this.oDashboardTabModel;
			var tier1 = oDashboardTabModel.getProperty("/ideationDto/tier1");
			var tier2 = oDashboardTabModel.getProperty("/ideationDto/tier2");
			var tier3 = oDashboardTabModel.getProperty("/ideationDto/tier3");
			var tier4 = oDashboardTabModel.getProperty("/ideationDto/tier4");
			oDashboardTabModel.setProperty("/ideationDto/tier1", tier1);
			dropdownServices.getTier2FromTier1(this, tier1, tier2, tier3, tier4);
		},
		
		//Function to get SKU's tab's visibility 
		getSelectedSKUTabVisiblity: function(){
			
			var that = this;
			this.busy.open();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			
			var sUrl = "/sku/api/rules/tabproperty";
			var taskDtos = oDashboardTabModel.getProperty("/taskDtos");
			var materialType = oDashboardTabModel.getProperty("/ideationDto/materialType");
			var oPayload = {
					"materialType":"HAWA",
					"tasks":[{"taskName":"Basic Attributes"},		 
							 {"taskName":"Weights and dims"}]


			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				var resultData = oEvent.getSource().getData();
				oDashboardVisibilityModel.setProperty("/tabVisibility", resultData);
				that.busy.close();
			});
			oModel.attachRequestFailed(function(oEvent) {
				that.busy.close();
				var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				util.toastMessage(errorText);
			});
		},
		
		//Function to get selected tab's fields visibility 
		onIconBarSelect: function(oEvent) {
			this.busy.open();
			var that = this, selectedTabKey;
			if(oEvent){
				selectedTabKey = oEvent.getSource().getSelectedKey();
			}else{
				selectedTabKey = oEvent;
			}
			
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardVisibilityModel.setProperty("/selTabKey",selectedTabKey);
			//var selectedTab = formatter.getSelectedTab(selectedTabKey);
			var sUrl = "/sku/api/rules/fieldproperty";
			var oDashboardTabModel = this.oDashboardTabModel;
			var materialType = oDashboardTabModel.getProperty("/ideationDto/materialType");
			var oPayload = {
					"materialType": "HAWA",
					"tasks":[{"taskName":"Basic Attributes"},
							 {"taskName":"Weights and dims"}],
					"tabName":"Ideation"
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				if(oEvent.getParameters("success")){
					var resultData = oEvent.getSource().getData();
					oDashboardVisibilityModel.setProperty("/Ideation", resultData);//Selected Key need to be replace with selecteddTab				
				}else{
					
				}
				that.busy.close();
			});
			oModel.attachRequestFailed(function(oEvent) {
				that.busy.close();
				var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				util.toastMessage(errorText);
			});
			
			//For NPC Element Visibility
			oDashboardVisibilityModel.setProperty("/isNpcYesBoxVisible", false);
			oDashboardVisibilityModel.setProperty("/isNpcNoBoxVisible", false);
			oDashboardVisibilityModel.refresh();
		},

		//Function to get forecast buom table data on read of a SKU
		getPercentForecastDmd: function(merchandisingDto) {

			var avgWeekUnitDemand = "",
				forecastBUOMWeek1 = "",
				forecastBUOMWeek2 = "";
			var forecastBUOMWeek3 = "",
				forecastBUOMWeek4 = "",
				forecastBUOMWeek5 = "";
			var forecastBUOMWeek6 = "";

			if (merchandisingDto.hasOwnProperty("avgWeekUnitDemand")) {
				avgWeekUnitDemand = merchandisingDto.avgWeekUnitDemand;
			}
			if (merchandisingDto.hasOwnProperty("forecastBUOMWeek1")) {
				forecastBUOMWeek1 = merchandisingDto.forecastBUOMWeek1;
			}
			if (merchandisingDto.hasOwnProperty("forecastBUOMWeek2")) {
				forecastBUOMWeek2 = merchandisingDto.forecastBUOMWeek2;
			}
			if (merchandisingDto.hasOwnProperty("forecastBUOMWeek3")) {
				forecastBUOMWeek3 = merchandisingDto.forecastBUOMWeek3;
			}
			if (merchandisingDto.hasOwnProperty("forecastBUOMWeek4")) {
				forecastBUOMWeek4 = merchandisingDto.forecastBUOMWeek4;
			}
			if (merchandisingDto.hasOwnProperty("forecastBUOMWeek5")) {
				forecastBUOMWeek5 = merchandisingDto.forecastBUOMWeek5;
			}
			if (merchandisingDto.hasOwnProperty("forecastBUOMWeek6")) {
				forecastBUOMWeek6 = merchandisingDto.forecastBUOMWeek6;
			}
			var week1Percent = this.calculateFieldVal(forecastBUOMWeek1, avgWeekUnitDemand);
			var week2Percent = this.calculateFieldVal(forecastBUOMWeek2, avgWeekUnitDemand);
			var week3Percent = this.calculateFieldVal(forecastBUOMWeek3, avgWeekUnitDemand);
			var week4Percent = this.calculateFieldVal(forecastBUOMWeek4, avgWeekUnitDemand);
			var week5Percent = this.calculateFieldVal(forecastBUOMWeek5, avgWeekUnitDemand);
			var week6Percent = this.calculateFieldVal(forecastBUOMWeek6, avgWeekUnitDemand);

			var oMerchandisingModel = this.oMerchandisingModel;
			var rows = [{
				"week1Input": week1Percent,
				"week2Input": week2Percent,
				"week3Input": week3Percent,
				"week4Input": week4Percent,
				"week5Input": week5Percent,
				"week6Input": week6Percent,
				"week1Text": "",
				"week2Text": "",
				"week3Text": "",
				"week4Text": "",
				"week5Text": "",
				"week6Text": "",
				"inputVisible": true,
				"textVisible": false
			}, {
				"week1Input": "",
				"week2Input": "",
				"week3Input": "",
				"week4Input": "",
				"week5Input": "",
				"week6Input": "",
				"week1Text": forecastBUOMWeek1,
				"week2Text": forecastBUOMWeek2,
				"week3Text": forecastBUOMWeek3,
				"week4Text": forecastBUOMWeek4,
				"week5Text": forecastBUOMWeek5,
				"week6Text": forecastBUOMWeek6,
				"inputVisible": false,
				"textVisible": true
			}];
			oMerchandisingModel.setProperty("/wkForecastData", rows);
			oMerchandisingModel.refresh();
		},

		//Function To Set Tab Visible and TabLayout field Editable
		isDashboardTabLayoutEditableVisible: function() {
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;

			//Ideation 
			oDashboardVisibilityModel.setProperty("/isIdeationVisible", true);
			oDashboardVisibilityModel.setProperty("/isIdeationEditable", true);

			//BasicProductAttribute 
			oDashboardVisibilityModel.setProperty("/isBasicProductAtrbVisible", true);
			oDashboardVisibilityModel.setProperty("/isBasicProductAtrbEditable", true);

			//Weights & Dims
			oDashboardVisibilityModel.setProperty("/isWeightsDimsVisible", true);
			oDashboardVisibilityModel.setProperty("/isWeightsDimsEditable", true);

			//Binning
			oDashboardVisibilityModel.setProperty("/isBinningVisible", true);
			oDashboardVisibilityModel.setProperty("/isBinningEditable", true);

			//Product Source
			oDashboardVisibilityModel.setProperty("/isProductSourceVisible", true);
			oDashboardVisibilityModel.setProperty("/isProductSourceEditable", true);

			//DMM
			oDashboardVisibilityModel.setProperty("/isDMMVisible", true);
			oDashboardVisibilityModel.setProperty("/isDMMEditable", true);

			//Merchandising
			oDashboardVisibilityModel.setProperty("/isMerchandisingVisible", true);
			oDashboardVisibilityModel.setProperty("/isMerchandisingEditable", true);

			//Store Front Attribute
			oDashboardVisibilityModel.setProperty("/isStrFrntAtrbVisible", true);
			oDashboardVisibilityModel.setProperty("/isStrFrntAtrbEditable", true);

			//Product tags 
			oDashboardVisibilityModel.setProperty("/isProductTagVisible", true);
			oDashboardVisibilityModel.setProperty("/isProductTagEditable", true);

			//Commercial Finance
			oDashboardVisibilityModel.setProperty("/isCommercialFinanceVisible", true);
			oDashboardVisibilityModel.setProperty("/isCommercialFinanceEditable", true);

			//Attachments
			oDashboardVisibilityModel.setProperty("/isAttachmentsVisible", true);
			oDashboardVisibilityModel.setProperty("/isAttachmentsEditable", true);

			//Comments
			oDashboardVisibilityModel.setProperty("/isCommentsVisible", true);
			oDashboardVisibilityModel.setProperty("/isCommentsEditable", true);

			//NPC
			oDashboardVisibilityModel.setProperty("/isNpcVisible", true);
			oDashboardVisibilityModel.setProperty("/isNpcVisible", true);
			

			oDashboardVisibilityModel.refresh();
		},

		//Function to preset the forecast values
		calculateFieldVal: function(forecastBUOMWeek, avgWeekUnitDemand) {
			if (forecastBUOMWeek && avgWeekUnitDemand) {
				forecastBUOMWeek = parseInt(forecastBUOMWeek);
				avgWeekUnitDemand = parseInt(avgWeekUnitDemand);
				var weekPercent = (forecastBUOMWeek / avgWeekUnitDemand) * 100;
				weekPercent = weekPercent.toString();
				if (weekPercent === "NaN") {
					weekPercent = "";
				} else {
					weekPercent = weekPercent + "%";
				}
				return weekPercent;
			} else {
				return "";
			}
		},

		//Function to load more data in Dashboard table
		onLoadMore: function() {

			var that = this;
			var oPaginationModel = this.oPaginationModel;
			var page = oPaginationModel.getProperty("/dashboardPage");
			that.loadDashboardData(++page);
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DASHBOARD_TABLE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<MODIFY_SKU>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		onModifyDropdownClick: function(oEvent) {
			var button = oEvent.getSource().getText();
			var navigationModel = this.oDropdownModel;

			if (button === "Ideation") {
				this.onDropDownSelect(2);
				navigationModel.setProperty("/selectKey", 2);
			} else if (button === "Basic Product Attributes") {
				this.onDropDownSelect(3);
				navigationModel.setProperty("/selectKey", 3);
			} else if (button === "Weights & Dims") {
				if (!this._weightNDimsDialog) {
					this._weightNDimsDialog = sap.ui.xmlfragment("freshdirect.SKU.fragments.weightDimsModifyDialog", this);
					this.getView().addDependent(this._weightNDimsDialog);
				}
				this._weightNDimsDialog.open();
				this.getWeightsAndDimsData();
			} else if (button === "Binning") {
				this.onDropDownSelect(4);
				navigationModel.setProperty("/selectKey", 4);
			} else if (button === "Sourcing Info (Pri)") {
				this.onDropDownSelect(5);
				navigationModel.setProperty("/selectKey", 5);
			} else if (button === "Ordering Info (Pri)") {
				this.onDropDownSelect(7);
				navigationModel.setProperty("/selectKey", 7);
			} else if (button === "Sourcing Info (Sec)") {
				this.onDropDownSelect(8);
				navigationModel.setProperty("/selectKey", 8);
			} else if (button === "Ordering Info (Sec)") {
				this.onDropDownSelect(10);
				navigationModel.setProperty("/selectKey", 10);
			} else if (button === "Merchandising") {
				this.onDropDownSelect(11);
				navigationModel.setProperty("/selectKey", 11);
			} else if (button === "Store Front Attributes") {
				this.onDropDownSelect(13);
				navigationModel.setProperty("/selectKey", 13);
			} else if (button === "Product Tags") {
				this.onDropDownSelect(14);
				navigationModel.setProperty("/selectKey", 14);
			}
			this.dropdownDialog.close();
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardVisibilityModel.setProperty("/cancelBtnVisible",true);
			if(button !== "Weights & Dims" && this.autoTblRowSelection ===  false){
				this.onModify();
			}
			if(this.autoTblRowSelection === false){
				this.autoTblRowSelection = true;
				return;
			}
		},

		onModify: function() {
			var that = this;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var oTable = this.getView().byId("SKU_DASHBOARD_TABLE");
			var selectedIndices = oDashboardModifyModel.getProperty("/indices");
			var length = selectedIndices.length;
			oTable.setEnableCellFilter(false);
			if (length > 0) {
				var oDashboardTableModel = this.oDashboardTableModel;
				var oDashboardTableData = oDashboardTableModel.getProperty("/listRequestDto");
				var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
				oDashboardVisibilityModel.setProperty("/beforeModifyVisible", false);
				var oTempArry = [];
				var oTempDashBoardTblData = jQuery.extend(true, [], oDashboardTableData);
				for (var i = 0; i < length; i++) {
					var data = oTempDashBoardTblData.splice((selectedIndices[i] - i), 1);
					data[0].key = true;
					oTempArry.push(data[0]);
				}
				var mergedArry = oTempArry.concat(oTempDashBoardTblData);
				var skuTempObjectModel = this.skuTempObjectModel;

				var data = skuTempObjectModel.getData();
				mergedArry.unshift(data);
				oDashboardTableModel.setProperty("/listRequestDto", mergedArry);
				this.autoTblRowSelection = true;
				oTable.clearSelection();
				oDashboardModifyModel.setProperty("/indices", []);
				this.autoTblRowSelection = true;
				oTable.setSelectionInterval(1, length);
				
				var indices = oDashboardModifyModel.getProperty("/indices");
				var selIndices = oTable.getSelectedIndices();
				for(var i=0; i<selIndices.length; i++){
					indices.push(parseInt(selIndices[i]));
				}
				oDashboardModifyModel.setProperty("/indices", indices);
				oDashboardTableModel.refresh();
				oDashboardVisibilityModel.setProperty("/loadMoreBtnVisible", false);
			}
		},

		onCopyOverpress: function(oEvent) {
			var oDashboardTableModel = this.oDashboardTableModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var selectedRows = oDashboardModifyModel.getProperty("/indices");
			var bindingKey;
			var controlType = oEvent.getSource().getParent().getItems()[0].getMetadata().getName();
			if(controlType === "sap.m.Switch"){
				bindingKey = oEvent.getSource().getParent().getItems()[0].getBindingPath("state");
			}else if(controlType === "sap.m.Select"){
				bindingKey = oEvent.getSource().getParent().getItems()[0].getBindingPath("selectedKey");
			}else if(controlType === "sap.m.Text"){
				bindingKey = oEvent.getSource().getParent().getItems()[1].getBindingPath("value");
			}
			var path = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath();
			var value = oDashboardTableModel.getProperty(path + "/" + bindingKey);
			if (controlType === "sap.m.DatePicker") {
				value = new date(value);
				value = value.getTime();
			}
			path = path.slice(0, path.length - 1);
			var selectedRowLen = selectedRows.length;
			var i, sPath;
			for (i = 0; i < selectedRowLen; i++) {
				sPath = path + selectedRows[i] + "/" + bindingKey;
				oDashboardTableModel.setProperty(sPath, value);
			}
			oDashboardTableModel.refresh();
		},

		//Function called from editable fields of dashboard table 
		onChange: function(oEvent) {
			var oDashboardTableModel = this.oDashboardTableModel;
			var path = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath();
			var bindingKey = oEvent.getSource().getParent().getItems()[0].getBindingPath("text");
			var tempArray = oDashboardTableModel.getProperty("/tempArray");
			var sPath = path + "/" + bindingKey;
			var value = oDashboardTableModel.getProperty(sPath);
			var part = path.slice(0, path.length - 1);
			var object = {
				"part": part,
				"bindingKey": bindingKey,
				"value": value
			};
			tempArray.push(object);
			oDashboardTableModel.refresh();
		},

		onCopyOverAllPress: function(oEvent) {
			var oDashboardTableModel = this.oDashboardTableModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var tempArray = oDashboardTableModel.getProperty("/tempArray");
			var tempArrayLen = tempArray.length;
			var selectedRows = oDashboardModifyModel.getProperty("/indices");
			var selectedRowLen = selectedRows.length;
			var i, j, sPath, value;
			if (selectedRowLen !== 0 && tempArrayLen !== 0) {
				for (i = 0; i < tempArrayLen; i++) {
					for (j = 0; j < selectedRowLen; j++) {
						sPath = tempArray[i].part + selectedRows[j] + "/" + tempArray[i].bindingKey;
						value = tempArray[i].value;
						oDashboardTableModel.setProperty(sPath, value);
					}
				}
				oDashboardTableModel.refresh();
			} else if (selectedRowLen === 0) {
				sap.m.MessageToast.show("Select the rows to be modified");
			} else if (tempArrayLen === 0) {
				sap.m.MessageToast.show("Enter the value in the input field to be modified");
			}
		},

		onModifySave: function(oEvent) {
			var oDashboardTableModel = this.oDashboardTableModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var selectedIndices = oDashboardModifyModel.getProperty("/indices");
			var oData = [];
			for (var i = 0; i < selectedIndices.length; i++) {
				var data = oDashboardTableModel.getData().listRequestDto[selectedIndices[i]];
				oData.push(data);
			}
			var obj = {
				"listRequestDto": ""
			};
			obj.listRequestDto = oData;
			this.busy.open();
			IdeationServices.onUpdateSKU(obj, this);
		},

		onModifyCancel: function(oEvent) {
			var data = this.tempModel.getData();
			var oDashboardTableModel = this.oDashboardTableModel;
			oDashboardTableModel.setData(data);
			oDashboardTableModel.refresh();

			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardVisibilityModel.setProperty("/beforeModifyVisible", true);

			var navigationModel = this.oDropdownModel;
			navigationModel.setProperty("/selectKey", 1);
			
			var oTable = this.getView().byId("SKU_DASHBOARD_TABLE");
			oTable.setEnableCellFilter(true);
			oTable.clearSelection();
		},

		getWeightsAndDimsData: function() {
			var oDashboardTableModel = this.oDashboardTableModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var oWeightsNDimsModel = this.oWeightsNDimsModel;
			var selectedIndices = oDashboardModifyModel.getProperty("/indices");
			oDashboardVisibilityModel.setProperty("/wtsnDimsModifyVisible",false);
			oWeightsNDimsModel.setProperty("/wtsNDimsRequestId", []);
			var reqIdArray = oWeightsNDimsModel.getProperty("/wtsNDimsRequestId");

			var data = oDashboardTableModel.getProperty("/listRequestDto");
			var wtsArray = [];

			for (var i = 0; i < selectedIndices.length; i++) {
				var oData = data[selectedIndices[i]].weightsAndDimsDtos;
				if(oData.length > 0){
					reqIdArray.push(oData[0].requestId);
				}
				for (var j = 0; j < oData.length; j++) {
					var upcData = data[selectedIndices[i]].ideationDto.referenceGtin;
					oData[j].referenceGtin = upcData;
					oData[j].projectId = data[i].projectId;
					oData[j].key = "true";
				}
				wtsArray = wtsArray.concat(oData);
			}
			var tempData = skuTempObjectModel.getProperty("/weightsAndDimsDto");
			var tempData = jQuery.extend(true, [], tempData);
			wtsArray.unshift(tempData);
			oWeightsNDimsModel.setProperty("/wnDtempArray", []);
			oWeightsNDimsModel.setProperty("/wtsDimsData", wtsArray);
			oWeightsNDimsModel.refresh();
		},
		
		onWtsNDimsChange : function(oEvent){
			var oWeightsNDimsModel = this.oWeightsNDimsModel;
			var path = oEvent.getSource().getBindingContext("oWeightsNDimsModel").getPath();
			var bindingKey = oEvent.getSource().getParent().getItems()[0].getBindingPath("text");
			var wnDtempArray = oWeightsNDimsModel.getProperty("/wnDtempArray");
			var sPath = path + "/" + bindingKey;
			var value = oWeightsNDimsModel.getProperty(sPath);
			var part = path.slice(0, path.length - 1);
			var object = {
				"part": part,
				"bindingKey": bindingKey,
				"value": value
			};
			wnDtempArray.push(object);
			oWeightsNDimsModel.refresh();
		},
		
		onWtsNDimsCopyOverpress : function(oEvent){
			var oWeightsNDimsModel = this.oWeightsNDimsModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var selectedRows = oWeightsNDimsModel.getProperty("/wtsDimsData");
			var bindingKey;
			var controlType = oEvent.getSource().getParent().getItems()[0].getMetadata().getName();
			if(controlType === "sap.m.Switch"){
				bindingKey = oEvent.getSource().getParent().getItems()[0].getBindingPath("state");
			}else if(controlType === "sap.m.Select"){
				bindingKey = oEvent.getSource().getParent().getItems()[0].getBindingPath("selectedKey");
			}else if(controlType === "sap.m.Text"){
				bindingKey = oEvent.getSource().getParent().getItems()[1].getBindingPath("value");
			}
			var path = oEvent.getSource().getBindingContext("oWeightsNDimsModel").getPath();
			var value = oWeightsNDimsModel.getProperty(path + "/" + bindingKey);
			if (controlType === "sap.m.DatePicker") {
				value = new date(value);
				value = value.getTime();
			}
			path = path.slice(0, path.length - 1);
			var selectedRowLen = selectedRows.length;
			var i, sPath;
			for (i = 1; i < selectedRowLen; i++) {
				sPath = path + i + "/" + bindingKey;
				oWeightsNDimsModel.setProperty(sPath, value);
			}
			oWeightsNDimsModel.refresh();
		},
		
		onWtsNDimsCopyOverAll : function(oEvent){
			var oWeightsNDimsModel = this.oWeightsNDimsModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var tempArray = oWeightsNDimsModel.getProperty("/wnDtempArray");
			var tempArrayLen = tempArray.length;
			var selectedRows = oWeightsNDimsModel.getProperty("/wtsDimsData");
			var selectedRowLen = selectedRows.length;
			var i, j, sPath, value;
			if (selectedRowLen !== 0 && tempArrayLen !== 0) {
				for (i = 0; i < tempArrayLen; i++) {
					for (j = 0; j < selectedRowLen; j++) {
						sPath = tempArray[i].part + j + "/" + tempArray[i].bindingKey;
						value = tempArray[i].value;
						oWeightsNDimsModel.setProperty(sPath, value);
					}
				}
				oWeightsNDimsModel.refresh();
			} else if (tempArrayLen === 0) {
				sap.m.MessageToast.show("Enter the value in the input field to be modified");
			}
		},
		
		onModifyWnDCancel: function() {
			var data = this.tempModel.getData();
			var oDashboardTableModel = this.oDashboardTableModel;
			oDashboardTableModel.setData(data);
			oDashboardTableModel.refresh();
			
			var oWeightsNDimsModel = this.oWeightsNDimsModel;
			oWeightsNDimsModel.setProperty("/wtsDimsData","");
			this._weightNDimsDialog.close();
		},

		onModifyWnDSubmit: function() {
			var oWeightsNDimsModel = this.oWeightsNDimsModel;
			var oDashboardModifyModel = this.oDashboardModifyModel;
			var selectedIndices = oDashboardModifyModel.getProperty("/indices");
			
			var oDashboardTableModel = this.oDashboardTableModel;
			var data = oDashboardTableModel.getProperty("/listRequestDto");
			
			var oData = oWeightsNDimsModel.getProperty("/wtsDimsData");
			oData.shift(1);
			var reqIdArray = oWeightsNDimsModel.getProperty("/wtsNDimsRequestId");
			
			for(var i=0;i<reqIdArray.length;i++){
				var skuArray = [];
				oData.filter(function(obj){
					if(reqIdArray[i] === obj.requestId){
						skuArray.push(obj);
						}
				});
				for(var j=0;j<selectedIndices.length;j++){
					if(data[selectedIndices[j]].requestId === reqIdArray[i]){
						data[selectedIndices[j]].weightsAndDimsDtos =  skuArray;
					}
				}	
			}
			oDashboardTableModel.refresh();
			this._weightNDimsDialog.close();
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<MODIFY_SKU>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DROPDOWN_NAV>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		/* Start Navigation Icons and Drop down Functionality */
		onNavItem1: function(oEvent) {
			var iconPressed = oEvent.getSource().getIcon();
			var navigationModel = this.oDropdownModel;
			var selectKey = parseInt(navigationModel.getProperty("/selectKey"));
			if (iconPressed === "sap-icon://navigation-left-arrow") {
				selectKey = selectKey - 1;
				navigationModel.setProperty("/selectKey", selectKey);
				this.setIconVisible();
			}
			if (iconPressed === "sap-icon://navigation-right-arrow") {
				selectKey = selectKey + 1;
				navigationModel.setProperty("/selectKey", selectKey);
				this.setIconVisible();
			}
		},

		setIconVisible: function() {
			var navigationModel = this.oDropdownModel;
			var navigationModelData = navigationModel.getData();
			var selectKey = parseInt(navigationModel.getProperty("/selectKey"));
			var maxKeyLength = navigationModelData.skuNavigationValues.length;
			if (selectKey === 1) {
				navigationModel.setProperty("/previousButtonEnabled1", false);
				navigationModel.setProperty("/nextButtonEnabled1", true);
			} else if (selectKey === maxKeyLength) {
				navigationModel.setProperty("/previousButtonEnabled1", true);
				navigationModel.setProperty("/nextButtonEnabled1", false);
			} else {
				navigationModel.setProperty("/previousButtonEnabled1", true);
				navigationModel.setProperty("/nextButtonEnabled1", true);
			}
			this.onDropDownSelect(selectKey);
			this.setSelectedKeyTabBar(selectKey);
		},

		setSelectedKeyTabBar: function(selectKey) {
			if (selectKey === 2) {
				this.getView().byId("iconTabId").setSelectedKey("01");
			} else if (selectKey === 3) {
				this.getView().byId("iconTabId").setSelectedKey("02");
			} else if (selectKey === 4) {
				this.getView().byId("iconTabId").setSelectedKey("03");
			} else if (selectKey === 5 || selectKey === 6 || selectKey === 7 || selectKey === 8 || selectKey === 9 || selectKey === 10) {
				this.getView().byId("iconTabId").setSelectedKey("04");
			} else if (selectKey === 11) {
				this.getView().byId("iconTabId").setSelectedKey("06");
			} else if (selectKey === 12) {
				this.getView().byId("iconTabId").setSelectedKey("05");
			} else if (selectKey === 13) {
				this.getView().byId("iconTabId").setSelectedKey("07");
			} else if (selectKey === 14) {
				this.getView().byId("iconTabId").setSelectedKey("08");
			} else if (selectKey === 15) {
				this.getView().byId("iconTabId").setSelectedKey("09");
			} else if (selectKey === 16) {
				this.getView().byId("iconTabId").setSelectedKey("10");
			} else if (selectKey === 17) {
				this.getView().byId("iconTabId").setSelectedKey("11");
			}
		},

		onDropDownSelect: function(selectKey) {
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			if (selectKey === 1) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", true);
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
			} else if (selectKey === 2) {
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
			} else if (selectKey === 3) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", true);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 4) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", true);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 5) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", true);
				oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey == 6) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", true);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 7) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", true);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 8) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/kpiStatusVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", true);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 9) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", true);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 10) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", true);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 11) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", true);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 12) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", true);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 13) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", true);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 14) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", true);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 15) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", true);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 16) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", true);
				oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 17) {
				oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				oDashboardVisibilityModel.setProperty("/binningVisible", false);
				oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				oDashboardVisibilityModel.setProperty("/commentsVisible", true);
			}
		},

		// Function to Download table in xls format 
		onExportClick:function(){
			jQuery.sap.require("freshdirect.SKU.util.exportDashboardTable");
			freshdirect.SKU.util.exportDashboardTable.onExportToCSV(this);
		},

		/* Start Title bar buttons functionality */
		onDropdownClick: function(oEvent) {
			var that = this;
			var oDropdownModel = this.oDropdownModel;
			var oButtonText = oEvent.getSource().getText();
			if (oButtonText === "Create") {
				oDropdownModel.setProperty("/noOfSkus", "1");
				oDropdownModel.setProperty("/createVisible", true);
				oDropdownModel.setProperty("/modifyVisible", false);
				oDropdownModel.setProperty("/uploadVisible", false);
				oDropdownModel.setProperty("/templateVisible", false);
			} else if (oButtonText === "Modify") {
				oDropdownModel.setProperty("/createVisible", false);
				oDropdownModel.setProperty("/modifyVisible", true);
				oDropdownModel.setProperty("/uploadVisible", false);
				oDropdownModel.setProperty("/templateVisible", false);
			} else if (oButtonText === "Upload") {
				oDropdownModel.setProperty("/createVisible", false);
				oDropdownModel.setProperty("/modifyVisible", false);
				oDropdownModel.setProperty("/uploadVisible", true);
				oDropdownModel.setProperty("/templateVisible", false);
			} else if (oButtonText === "Templates") {
				oDropdownModel.setProperty("/createVisible", false);
				oDropdownModel.setProperty("/modifyVisible", false);
				oDropdownModel.setProperty("/uploadVisible", false);
				oDropdownModel.setProperty("/templateVisible", true);
			}
			if (!this.dropdownDialog) {
				this.dropdownDialog = sap.ui.xmlfragment("freshdirect.SKU.fragments.dashboardDropdown", this);
				this.getView().addDependent(this.dropdownDialog);
			}
			this.dropdownDialog.openBy(oEvent.getSource());
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DROPDOWN_NAV>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CREATE_SKU>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//Below functions enables user to create single SKU
		onCreateNewSKU: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var skuTempObjectModel = this.skuTempObjectModel;
			var oTempObj = skuTempObjectModel.getData();
			oDashboardTabModel.setData(oTempObj);

			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardVisibilityModel.setProperty("/tabVisible", true);
			
			oDashboardVisibilityModel.setProperty("/createRefernceEnable", true);
			this.dropdownDialog.close();
			this.getView().byId("iconTabId").setSelectedKey("01");
			this.createForecastTblData();
			//Set tab visibility
		},

		onCreateReferenceSKU: function() {
			var oTable = this.getView().byId("SKU_DASHBOARD_TABLE");
			var data = this.oDashboardTabModel.getData();

			oTable.clearSelection();

			data.ideationDto.referenceGtin = "";
			data.ideationDto.gtinCS = "";
			data.ideationDto.gtinEA = "";
			data.ideationDto.gtinIN = "";
			data.ideationDto.caseCheck = "";
			data.ideationDto.eachCheck = "";
			data.ideationDto.innerCheck = "";
			data.requestId = "";
			data.projectId = "";
			this.oDashboardTabModel.refresh();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CREATE_SKU>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DOWNLOAD_TEMPLATES>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to download templates
		onDownloadTemplate: function(oEvent) {

			var that = this;
			this.busy.open();
			var sUrl = "",
				fileName = "";
			var templateName = oEvent.getSource().getCustomData()[0].getValue();

			var oDashboardTableModel = this.oDashboardTableModel;
			var oDashboardTbl = this.getView().byId("SKU_DASHBOARD_TABLE");
			var selectedRows = oDashboardTbl.getSelectedIndices();

			if (selectedRows.length) {
				switch (templateName) {
					case "BASIC_PRODUCT_ATTRIBUTE":
						sUrl = "/sku/api/excel/basicproductattributetemplate";
						fileName = "Basic Product Attributes";
						break;
					case "WEIGHT_DIMS":
						sUrl = "/sku/api/excel/weightsanddimstemplate";
						fileName = "Weights and Dims";
						break;
					case "COST_SHEET":
						sUrl = "/sku/api/excel/costsheettemplate";
						fileName = "Cost Sheet";
						break;
					case "ORDERING_INFO":
						sUrl = "/sku/api/excel/orderinfotemplate";
						fileName = "Odering Info";
						break;
					case "ERPSY_NUTRITIO_DATA":
						sUrl = "";
						fileName = "Erpsy Nutrition Data";
						break;
					case "CMS_DATA":
						sUrl = "";
						fileName = "CMS Data";
						break;
					case "BOM_DATA":
						sUrl = "";
						fileName = "BOM Data";
						break;
					case "ROUTING_DATA":
						sUrl = "";
						fileName = "Routing Data";
						break;
				}
				if (sUrl) {
					var tempArry = [];
					for (var i = 0; i < selectedRows.length; i++) {
						var oTempObj = {};
						var tblIndex = selectedRows[i];
						oTempObj.requestId = oDashboardTableModel.getProperty("/listRequestDto/" + tblIndex + "/requestId");
						oTempObj.referenceGtin = oDashboardTableModel.getProperty("/listRequestDto/" + tblIndex + "/ideationDto/referenceGtin");
						oTempObj.brand = oDashboardTableModel.getProperty("/listRequestDto/" + tblIndex + "/ideationDto/brand");
						oTempObj.productDescription = oDashboardTableModel.getProperty("/listRequestDto/" + tblIndex + "/ideationDto/description");
						tempArry.push(oTempObj);
					}
					var oPayload = {
						"listGtinDetailsDto": tempArry
					};
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, this.oHeader);
					oModel.attachRequestCompleted(function(oEvent) {
						if (oEvent.getParameter("success")) {
							var resultData = oEvent.getSource().getData();
							that.downloadSKUDocument(resultData, fileName);
							util.toastMessage("Successfully downloaded template");
						} else {
							util.toastMessage("Error downloading template");
						}
						that.dropdownDialog.close();
						that.busy.close();
					});
					oModel.attachRequestFailed(function(oEvent) {
						that.dropdownDialog.close();
						that.busy.close();
						util.toastMessage("Error downloading template");
					});
				}
			} else {
				util.toastMessage("Please select SKUs to download");
			}
			this.busy.close();
		},

		//Function to download 
		downloadSKUDocument: function(resultData, fileName) {
			var base64 = resultData.base64;
			var fileType = ".xls";
			var type = "data:application/vnd.ms-excel;base64";
			var uri = type + "," + escape(base64);
			var link = document.createElement('a');
			link.addEventListener('click', function(ev) {
				link.href = uri;
				link.download = fileName + "." + fileType;
			}, false);
			link.click();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DOWNLOAD_TEMPLATES>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<UPLOAD_DOC>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function that opens the Upload UI pop-up
		openDocUploadUI: function(oEvent) {
			if (!this._uploadDocDialog) {
				this._uploadDocDialog = sap.ui.xmlfragment("freshdirect.SKU.fragments.uploadDocument", this);
				this.getView().addDependent(this._uploadDocDialog);
			}
			this._uploadDocDialog.open();

			var oModel = this.oUploadModel;
			oModel.setProperty("/fileUpload", "");
			oModel.setProperty("/b64", "");
			oModel.setProperty("/filename", "");
			oModel.setProperty("/createdBy", "");
		},

		//Function to close Upload UI pop-up
		onCancelDocUpload: function() {
			this._uploadDocDialog.close();

			var oModel = this.oUploadModel;
			oModel.setProperty("/fileUpload", "");
			oModel.setProperty("/b64", "");
			oModel.setProperty("/filename", "");
			oModel.setProperty("/createdBy", "");
		},

		//Function to browse document from local system
		onBrowseSKUDocument: function(oEvent) {
			var that = this;
			var oModel = this.oUploadModel;
			var ext = oEvent.getSource().getValue().split(".")[oEvent.getSource().getValue().split(".").length - 1];
			ext = ext.toLowerCase();

			if (oEvent.getSource().oFileUpload.files[0].size >= "10485760") {
				oModel.setProperty("/fileUpload", "");
				oModel.setProperty("/b64", "");
				oModel.setProperty("/filename", "");
				util.toastMessage("File size exceeded. Maximum file size accepted 5MB.");
				return;
			} else {
				if (ext == "pdf" || ext == "PDF" || ext == "xls" || ext == "XLS" || ext == "xlsx" || ext == "XLSX" ||
					ext === "jpg" || ext === "jpeg" || ext === "docx") {
					var fileName = oEvent.oSource.oFileUpload.files[0];
					var reader = new FileReader();
					reader.readAsDataURL(fileName);
					reader.onload = function(event) {
						if (fileName.name.length <= 50) {
							var s = event.target.result;
							var docType = s.split(",")[0];
							var base64 = s.split(",")[1];
							oModel.getData().docType = docType;
							oModel.getData().b64 = base64;
							oModel.getData().filename = fileName.name;
							oModel.setProperty("/createdBy", ""); //loggedInUserName;
						} else {
							util.toastMessage("Please upload file with file name less than 50 characters in length");
							oModel.setProperty("/fileUpload", "");
							oModel.setProperty("/b64", "");
							oModel.setProperty("/filename", "");
							oModel.setProperty("/createdBy", ""); //loggedInUserName;
						}
					};
				} else {
					oModel.setProperty("/fileUpload", "");
					oModel.setProperty("/b64", "");
					oModel.setProperty("/filename", "");
					oModel.setProperty("/createdBy", ""); //loggedInUserName;
					util.toastMessage("Please upload file types of xls, xlsx, jpeg, jpg, docx and pdf");
				}
			}
			oModel.refresh(true);
		},

		//Function to upload dco to server
		onUploadSKUDocument: function() {

			var that = this;
			this.busy.open();
			var sUrl = "";
			var oUploadModel = this.oUploadModel;

			var selectedFileType = oUploadModel.getProperty("/fileUpload");
			switch(selectedFileType){
			case "WEIGHTS_AND_DIMS":
				sUrl="/sku/api/excelimport/import_weights&dims";
				break;
			case "BASIC_ATTRIBUTES":
				sUrl="/sku/api/excelimport/import_basicattributes";
				break;
			case "COST_SHEET":
				sUrl="/sku/api/excelimport/import_costsheet";
				break;
			case "ORDER_INFO":
				sUrl="/sku/api/excelimport/import_orderinfo";
				break;
			}
			
			var base64File = oUploadModel.getProperty("/b64");

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(base64File), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				var message = "";
				if (oEvent.getParameter("success")) {
					var resultData = oEvent.getSource().getData();
					message = "Document uploaded successfully";
				} else {
					message = "Error in Uplaoding document. Please try again";
				}
				that.busy.close();
				util.toastMessage(message);
			});

			oModel.attachRequestFailed(function(oEvent) {
				that.busy.close();
				var message = "Error in Uplaoding document. Please try again";
				util.toastMessage(message);
			});
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<UPLOAD_DOC>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to update the boolean value for the switches in all tabs
		onSwitchChange: function(oEvent) {
			var oEventSource = oEvent.getSource().getCustomData()[0].getValue();
			var bindingKey;
			var bVal = oEvent.getSource().getState();
			var sPath;
			if(oEventSource === "TABLE"){
				var oDashboardTableModel = this.oDashboardTableModel;
				var path = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath();
				bindingKey = oEvent.getSource().getBindingPath("state");
				sPath = path +"/"+ bindingKey;
				oDashboardTableModel.setProperty(sPath, bVal);
				var index=path.split("/")[2];
				if (index==="0"){
					this.onChange(oEvent);
				}
			}else{
				var oDashboardTabModel = this.oDashboardTabModel;
				bindingKey = oEvent.getSource().getBindingPath("state");
				sPath = bindingKey; 
				oDashboardTabModel.setProperty(sPath, bVal);
			}
		},

		//Function to update the value for the Input in all tabs
		onInputFieldChange: function(oEvent){
			
			var sPath;
			var oVal = oEvent.getSource().getValue();
			var name = oEvent.getSource().getName();
			switch (name) {
			case "STORAGE_TEMP_MIN":
				sPath = "/basicAttributeDto/storeTemperatureMinimum"; //Basic Attributes
					break;
			case "STORAGE_TEMP_MAX":
				sPath = "/basicAttributeDto/storeTemperatureMaximum"; //Basic Attributes
					break;
			case "SOURCE_CONTRACT_ID":
				sPath = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
				sPath = sPath + "/sourceInfoDto/sourceContractId"; //Sourcing Info
					break;
			}
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty(sPath, oVal);
			oDashboardTabModel.refresh();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<IDEATION_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to update the property of UPCed Product switch
		onChangeUPCedProduct: function(oEvent) {
			var bVal = oEvent.getSource().getState();
			var oDashboardTabModel = this.oDashboardTabModel;
			var refNumber = oDashboardTabModel.getProperty("/ideationDto/referenceGtin");
			if(refNumber){
				this.upcCheckDigitValidation();
			}
			oDashboardTabModel.setProperty("/ideationDto/isNonUpcProduct", bVal);
			oDashboardTabModel.refresh();
		},

		//Function to check, entered UPC is valid or invalid 
		upcCheckDigitValidation: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var upcProduct = oDashboardTabModel.getProperty("/ideationDto/isNonUpcProduct");
			if (upcProduct) {
				this.busy.open();
				IdeationServices.checkUPCDigitValidation(this);
			}
		},

		//Free text search on Brand 
		onSuggestBrand: function(oEvent) {
			var that = this;
			var aFilters = [],
				sFilter;
			var oInput = oEvent.getSource();
			var sQuery = oInput.getValue();
			var manufaturersData = this.oDropdownModel.getProperty("/allBrandList");

			if (sQuery && sQuery.length > 0) {
				sFilter = new sap.ui.model.Filter("value", sap.ui.model.FilterOperator.Contains, sQuery);
			}
			aFilters.push(sFilter);

			var binding = oInput.getBinding("suggestionItems");
			binding.filter(aFilters);
		},

		//Set selected key on brand drop down
		onBrandSelection: function(oEvent) {
			var brand = oEvent.getParameters().selectedItem.getText();
			var templateName = oEvent.getSource().getCustomData()[0].getValue();
			
			if (templateName === "MM_TAB_BRAND") {
				this.oDashboardTabModel.setProperty("/ideationDto/brand", brand);
				this.oDashboardTabModel.setProperty("/ideationDto/isBrandNew", false);
				this.oDashboardTabModel.refresh();
				this.setSAPProductDesc();
			} else if (templateName === "MM_TABLE_BRAND") {
				var sPath = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath();
				var index = sPath.split("/")[2];
				this.oDashboardTableModel.setProperty("/listRequestDto/" + index + "/ideationDto/brand", brand);
				this.oDashboardTableModel.refresh(true);
			}
		},

		//Free text search on Manufacturer 
		onSuggestMfg: function(oEvent) {
			var that = this;
			var aFilters = [],
				sFilter;
			var oInput = oEvent.getSource();
			var sQuery = oInput.getValue();
			var manufaturersData = this.oDropdownModel.getProperty("/allManufacturerList");

			if (sQuery && sQuery.length > 0) {
				sFilter = new sap.ui.model.Filter("key", sap.ui.model.FilterOperator.Contains, sQuery);
			}
			aFilters.push(sFilter);

			var binding = oInput.getBinding("suggestionItems");
			binding.filter(aFilters);
		},

		//Set selected key on manufacturer
		onMfgSelection: function(oEvent) {
			var manufacturer = oEvent.getParameters().selectedItem.getText();
			var templateName = oEvent.getSource().getCustomData()[0].getValue();
			if (templateName === "MM_TAB_MANUFACTURER") {
				this.oDashboardTabModel.setProperty("/ideationDto/manufacturer", manufacturer);
				this.oDashboardTabModel.setProperty("/ideationDto/isManufacturerNew", false);
				this.oDashboardTabModel.refresh();
			} else if (templateName === "MM_TABLE_MANUFACTURER") {
				var sPath = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath();
				var index = sPath.split("/")[2];
				this.oDashboardTableModel.setProperty("/listRequestDto/" + index + "/ideationDto/manufacturer", manufacturer);
				this.oDashboardTableModel.refresh();
			}
		},

		//Free text search on Attribute1
		onSuggestAttribute1: function(oEvent) {
			var that = this;
			var aFilters = [],
				sFilter;
			var oInput = oEvent.getSource();
			var sQuery = oInput.getValue();
			var manufaturersData = this.oDropdownModel.getProperty("/attribute1");

			if (sQuery && sQuery.length > 0) {
				sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
			}
			aFilters.push(sFilter);

			var binding = oInput.getBinding("suggestionItems");
			binding.filter(aFilters);
		},

		//Set selected key on Attribute1
		onAttribute1Selection: function(oEvent) {
			var attribute = oEvent.getParameters().selectedItem.getText();
			this.oDashboardTabModel.setProperty("/ideationDto/attribute1", attribute);
			this.oDashboardTabModel.refresh();
		},

		//Free text search on Attribute2
		onSuggestAttribute2: function(oEvent) {
			var that = this;
			var aFilters = [],
				sFilter;
			var oInput = oEvent.getSource();
			var sQuery = oInput.getValue();
			var manufaturersData = this.oDropdownModel.getProperty("/attribute2");

			if (sQuery && sQuery.length > 0) {
				sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
			}
			aFilters.push(sFilter);

			var binding = oInput.getBinding("suggestionItems");
			binding.filter(aFilters);
		},

		//Set selected key on Attribute2
		onAttribute2Selection: function(oEvent) {
			var attribute = oEvent.getParameters().selectedItem.getText();
			this.oDashboardTabModel.setProperty("/ideationDto/attribute2", attribute);
			this.oDashboardTabModel.refresh();
		},

		//Free text search on Attribute3
		onSuggestAttribute3: function(oEvent) {
			var that = this;
			var aFilters = [],
				sFilter;
			var oInput = oEvent.getSource();
			var sQuery = oInput.getValue();
			var manufaturersData = this.oDropdownModel.getProperty("/attribute3");

			if (sQuery && sQuery.length > 0) {
				sFilter = new sap.ui.model.Filter("attribute", sap.ui.model.FilterOperator.Contains, sQuery);
			}
			aFilters.push(sFilter);

			var binding = oInput.getBinding("suggestionItems");
			binding.filter(aFilters);
		},

		//Set selected key on Attribute3
		onAttribute3Selection: function(oEvent) {
			var attribute = oEvent.getParameters().selectedItem.getText();
			this.oDashboardTabModel.setProperty("/ideationDto/attribute3", attribute);
			this.oDashboardTabModel.refresh();
		},

		//Free text search on Attribute4
		onSuggestAttribute4: function(oEvent) {
			var that = this;
			var aFilters = [],
				sFilter;
			var oInput = oEvent.getSource();
			var sQuery = oInput.getValue();
			var manufaturersData = this.oDropdownModel.getProperty("/attribute4");

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

		//Set selected key on Attribute4
		onAttribute4Selection: function(oEvent) {
			var attribute = oEvent.getParameters().selectedItem.getText();
			this.oDashboardTabModel.setProperty("/ideationDto/attribute4", attribute);
			this.oDashboardTabModel.refresh();
		},

		//Free text search on Tier1 and set list value for Tier2
		onTier1Selection: function(oEvent,val) {
			
			var that = this;
			var oServiceModel = new sap.ui.model.json.JSONModel();
			var oMerchandisingModel = this.oMerchandisingModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			
			if(oEvent){
				var selectedkey = oEvent.getSource().getSelectedKey();
				var templateName = oEvent.getSource().getCustomData()[0].getValue();

				var oPayload = {
						"tier1": selectedkey
					};
			
				var sUrl = "/sku/api/dw/tier2/";
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/tiers");
						data = formatter.convertObjectToArray(data);
						that.oDropdownModel.setProperty("/tier2List", data);
						oDashboardVisibilityModel.setProperty("/isIdeationTier2Editable", true);
						oDashboardVisibilityModel.setProperty("/isIdeationTier3Editable", false);
						oDashboardVisibilityModel.setProperty("/isIdeationTier4Editable", false);
						dropdownServices.getMerchantAttributes(that);
					} else {
						//Error Msg;
					}
				});
				oServiceModel.attachRequestFailed(function(oEvent) {
					//Error Msg;
				});

				that.oDropdownModel.setProperty("/tier2List", "");
				that.oDropdownModel.setProperty("/tier3List", "");
				that.oDropdownModel.setProperty("/tier4List", "");
				if (templateName === "MM_IDEATION_TIER1") {
					that.oDashboardTabModel.setProperty("/ideationDto/tier2", "");
					that.oDashboardTabModel.setProperty("/ideationDto/tier3", "");
					that.oDashboardTabModel.setProperty("/ideationDto/tier4", "");
				} else if (templateName === "MM_REFERENCE_MAT_TIER1") {
					that.oMerchandisingModel.setProperty("/tier2", "");
					that.oMerchandisingModel.setProperty("/tier3", "");
					that.oMerchandisingModel.setProperty("/tier4", "");
				}
				that.clearCategory();
			}
			else{
				var oPayload = {
					"tier1" : val	
				};
				var sUrl = "/sku/api/dw/tier2/";
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/tiers");
						data = formatter.convertObjectToArray(data);
						that.oDropdownModel.setProperty("/tier2List", data);
						oMerchandisingModel.setProperty("/tier2","Condiments and Dressings Refrigerated");
						that.onTier2Selection("","Condiments and Dressings Refrigerated");
					}
				});
				oServiceModel.attachRequestFailed(function(oEvent) {
					//Error Msg;
				});
			}
		},

		//Free text search on Tier2 and set list value for Tier3
		onTier2Selection: function(oEvent,val) {
			
			var that = this;
			var oServiceModel = new sap.ui.model.json.JSONModel();
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var oMerchandisingModel = this.oMerchandisingModel;
			
			if(oEvent){
				var selectedkey = oEvent.getSource().getSelectedKey();
				var templateName = oEvent.getSource().getCustomData()[0].getValue();
			
				var oPayload = {
						"tier2": selectedkey
					};
			
				var sUrl = "/sku/api/dw/tier3/";
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/tiers");
						data = formatter.convertObjectToArray(data);
						that.oDropdownModel.setProperty("/tier3List", data);
						oDashboardVisibilityModel.setProperty("/isIdeationTier3Editable", true);
						oDashboardVisibilityModel.setProperty("/isIdeationTier4Editable", false);
						dropdownServices.getMerchantAttributes(that);
					} else {
						//Error msg;
					}
				});	
				oServiceModel.attachRequestFailed(function(oEvent) {
					//Error msg;
				});

				that.oDropdownModel.setProperty("/tier3List", "");
				that.oDropdownModel.setProperty("/tier4List", "");
				if (templateName === "MM_IDEATION_TIER2") {
					that.oDashboardTabModel.setProperty("/ideationDto/tier3", "");
					that.oDashboardTabModel.setProperty("/ideationDto/tier4", "");
				} else if (templateName === "MM_REFERENCE_MAT_TIER2") {
					that.oMerchandisingModel.setProperty("/tier3", "");
					that.oMerchandisingModel.setProperty("/tier4", "");
				}
			} else{
				var oPayload = {
					"tier2" : val
				};
				var sUrl = "/sku/api/dw/tier3/";
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/tiers");
						data = formatter.convertObjectToArray(data);
						that.oDropdownModel.setProperty("/tier3List", data);
						oMerchandisingModel.setProperty("/tier3","Olives Mushrooms and Veggies Rfdg");
						that.onTier3Selection("","Olives Mushrooms and Veggies Rfdg");
					}
				});
				oServiceModel.attachRequestFailed(function(oEvent) {
					//Error Msg;
				});
			}
		},

		//Free text search on Tier3 and set list value for Tier4
		onTier3Selection: function(oEvent,val) {
			
			var that = this;
			var oServiceModel = new sap.ui.model.json.JSONModel();
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var oMerchandisingModel = this.oMerchandisingModel;
			
			if(oEvent){				
				var oServiceModel = new sap.ui.model.json.JSONModel();
				var selectedkey = oEvent.getSource().getSelectedKey();
				var templateName = oEvent.getSource().getCustomData()[0].getValue();
				
				var oPayload = {
						"tier3": selectedkey
					};
				
				var sUrl = "/sku/api/dw/tier4/";
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/tiers");
						data = formatter.convertObjectToArray(data);
						that.oDropdownModel.setProperty("/tier4List", data);
						oDashboardVisibilityModel.setProperty("/isIdeationTier4Editable", true);
						dropdownServices.getMerchantAttributes(that);
					} else {
						//Error Msg
					}
				});
				oServiceModel.attachRequestFailed(function(oEvent) {
					//Error Msg;
				});
	
				that.oDropdownModel.setProperty("/tier4List", "");
				if (templateName === "MM_IDEATION_TIER3") {
					that.oDashboardTabModel.setProperty("/ideationDto/tier4", "");
				} else if (templateName === "MM_REFERENCE_MAT_TIER3") {
					that.oMerchandisingModel.setProperty("/tier4", "");
				}
			} else{
				var oPayload = {
						"tier3" : val	
					};
					var sUrl = "/sku/api/dw/tier4/";
					oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
					oServiceModel.attachRequestCompleted(function(oEvent) {
						if (oEvent.getParameter("success")) {
							var data = oEvent.getSource().getProperty("/tiers");
							data = formatter.convertObjectToArray(data);
							that.oDropdownModel.setProperty("/tier4List", data);
							oMerchandisingModel.setProperty("/tier4","Mushrooms Rfdg");
							oMerchandisingModel.refresh();
						}
					});
					oServiceModel.attachRequestFailed(function(oEvent) {
						//Error Msg;
					});
				}
		},

		//Close Ideation Distributor pop-up on select of a GTIN config
		onSelectHierachies: function(oEvent) {
			oEvent.getSource().getParent().close();
		},

		//Close Ideation Distributor pop-up on click of Cancel button
		closeIdeationHierachiesDlg: function(oEvent) {
			oEvent.getSource().getParent().close();
		},

		//Check box validation in FD Sellable section
		onFdSellableCheckBoxSelect: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var selectedBox = oEvent.getSource().getText();
			var eachSelected = oDashboardTabModel.getProperty("/ideationDto/eachCheck");
			var innerSelected = oDashboardTabModel.getProperty("/ideationDto/innerCheck");
			if (selectedBox === "Each (EA)" && innerSelected == true) {
				oEvent.getSource().setSelected(false);
				util.toastMessage("You cannot select Each with Inner");
			}
			if (selectedBox === "Inner Pack (PK)" && eachSelected == true) {
				oEvent.getSource().setSelected(false);
				util.toastMessage("You cannot select Inner with Each");
			}
		},

		//Function to open pop-up to add new Brand
		openAddBrandPopup: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var brand = oDashboardTabModel.getProperty("/ideationDto/brand");
			oDashboardTabModel.setProperty("/ideationDto/newBrandValue", brand);
			oDashboardTabModel.refresh();
			if (!this.addBrandPopover) {
				this.addBrandPopover = sap.ui.xmlfragment("freshdirect.SKU.fragments.addBrand", this);
				this.getView().addDependent(this.addBrandPopover);
			}
			this.addBrandPopover.openBy(oEvent.getSource());
		},

		//Function to add new Brand to close pop-up
		onAddNewBrand: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var newValue = oDashboardTabModel.getProperty("/ideationDto/newBrandValue");
			var oldValue = oDashboardTabModel.getProperty("/ideationDto/brand");
			if(newValue !== oldValue){
			oDashboardTabModel.setProperty("/ideationDto/isBrandNew", true);
			oDashboardTabModel.setProperty("/ideationDto/brand", newValue);
			oDashboardTabModel.setProperty("/ideationDto/newBrandValue", "");
			oDashboardVisibilityModel.setProperty("/newBrandText", true);
			}
			oDashboardTabModel.refresh();
			oDashboardVisibilityModel.refresh();
			this.addBrandPopover.close();
		},

		//Function to close Brand pop-up
		onRejectNewBrand: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/ideationDto/newBrandValue", "");
			oDashboardTabModel.setProperty("/ideationDto/isBrandNew", false);
			oDashboardTabModel.refresh();
			this.addBrandPopover.close();
		},
		
		//Function to check brand value
		onBrandValueChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardTabModel.setProperty("/ideationDto/isBrandNew", false);
			oDashboardVisibilityModel.setProperty("/newBrandText", false);
			oDashboardTabModel.refresh();
			oDashboardVisibilityModel.refresh();
		},


		//Function to open pop-up to add new Mfg
		openAddMfgPopup: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var manufacturer = oDashboardTabModel.getProperty("/ideationDto/manufacturer");
			oDashboardTabModel.setProperty("/ideationDto/newManufacturerValue", manufacturer);
			oDashboardTabModel.refresh();
			if (!this.addManufacturerPopover) {
				this.addManufacturerPopover = sap.ui.xmlfragment("freshdirect.SKU.fragments.addManufacturer", this);
				this.getView().addDependent(this.addManufacturerPopover);
			}
			this.addManufacturerPopover.openBy(oEvent.getSource());
		},

		//Function to close Mfg pop-up
		onRejectNewManufacturer: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/ideationDto/isManufacturerNew", false);
			oDashboardTabModel.refresh();
			this.addManufacturerPopover.close();
		},

		//Function to add new Mfg to close pop-up
		onAddNewManufacturer: function() {
			var oDropdownModel = this.oDropdownModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var newValue = oDashboardTabModel.getProperty("/ideationDto/newManufacturerValue");
			var oldValue = oDashboardTabModel.getProperty("/ideationDto/manufacturer");
			if(newValue !== oldValue){
				oDashboardTabModel.setProperty("/ideationDto/isManufacturerNew", true);
				oDashboardTabModel.setProperty("/ideationDto/manufacturer", newValue);
				oDashboardTabModel.setProperty("/ideationDto/newManufacturerValue", "");
				this.oDashboardVisibilityModel.setProperty("/newMFGText", true);
			}
			this.oDashboardVisibilityModel.refresh();
			oDashboardTabModel.refresh();
			this.addManufacturerPopover.close();
		},

		//Function To change MFG Value
		onMfgValueChange: function(){
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardTabModel.setProperty("/ideationDto/isManufacturerNew", false);
			oDashboardVisibilityModel.setProperty("/newMFGText", false);
			oDashboardTabModel.refresh();
			oDashboardVisibilityModel.refresh();
		},

		//Function to enable SAP Product Description TextArea
		onSAPProdDescEdit: function() {
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var bVal = oDashboardVisibilityModel.getProperty("/sapProdDescEditEnabled");
			if(bVal){
				oDashboardVisibilityModel.setProperty("/sapProdDescEditEnabled", false);
			} else {
			oDashboardVisibilityModel.setProperty("/sapProdDescEditEnabled", true);
			}
		},

		//Function to auto set Target Activation date picker value and disable
		targetActitivationDate: function() {
			var today = new Date();
			var modDate = today.setDate(today.getDate() + 13);
			var finaldate = new Date(modDate);
			return finaldate;
		},

		//Function sets the Target Activation Date when Target ASAP is checked
		onTarActASAP: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var finalDate = this.targetActitivationDate();
			var checkboxState = oEvent.getSource().getSelected();
			if (checkboxState === true) {
				oDashboardVisibilityModel.setProperty("/tarActDateEnabled", false);
				oDashboardTabModel.setProperty("/ideationDto/targetActivationDate", finalDate);
			} else {
				oDashboardVisibilityModel.setProperty("/tarActDateEnabled", true);
				oDashboardTabModel.setProperty("/ideationDto/targetActivationDate", "");
			}
			oDashboardVisibilityModel.refresh();
		},

		//Function is triggered when Target Activation date is selected Manually
		onTargetActivationDateChange: function(oEvent) {
			var oCurrentDate = new Date();
			var oDashboardTabModel = this.oDashboardTabModel;
			var selectedDate = oEvent.getSource().getDateValue();
			
			if(selectedDate > oCurrentDate){
				oDashboardTabModel.setProperty("/ideationDto/targetActivationDate", selectedDate);
			} else {
			var oResourceModel = this.oResourceModel;
				oDashboardTabModel.setProperty("/ideationDto/targetActivationDate", oCurrentDate);
				var errorMessage = "Select as date greater than Todays's date";//oResourceModel.getText("TARGET_ACTIVATION_ERROR");
				util.toastMessage(errorMessage);
			}
		},

		//Function to open 
		openHierarchiesPopUp: function(){
			this.busy.open();
			IdeationServices.openHierarchiesPopUp(this);
		},
		
		//Function to Save SKU sections  
		onIdeationSave: function(oEvent) {
			this.busy.open();
			var sUrl = "/sku/api/request/update";
			IdeationServices.onSaveSubmitCompleteSku(this, sUrl, "", "", "IDEATION");
		},
		
		//Function to submit Ideation tab
		onSubmitIdeationTab: function(oEvent){
			this.busy.open();
			var sUrl = "/sku/api/request/update";
			var oGDSNHierarchyDialog = oEvent.getSource().getParent();
			IdeationServices.onSaveSubmitCompleteSku(this, sUrl, "", "", "FEASIBILITY", oGDSNHierarchyDialog);
		},
		
		//Function to clear the changes and make icon tab bar visiblity = false
		onDashboardTabCancel: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var skuTempObjectModel = this.skuTempObjectModel;
			var oTempObj = skuTempObjectModel.getData();
			oDashboardTabModel.setData(oTempObj);

			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			oDashboardVisibilityModel.setProperty("/sapProdDescEditEnabled", false);
			oDashboardVisibilityModel.setProperty("/UPCInvalidVisiblity", false);
			oDashboardVisibilityModel.setProperty("/UPCValidVisiblity", false);
			oDashboardVisibilityModel.setProperty("/UPCCheckboxState", false);
			oDashboardVisibilityModel.setProperty("/sapProdDescValidVisiblity", false);
			oDashboardVisibilityModel.setProperty("/sapProdDescInvalidVisiblity", false);
			oDashboardVisibilityModel.setProperty("/tabVisible", false);
			oDashboardVisibilityModel.setProperty("/modifyBtnEnabled", false);
			oDashboardVisibilityModel.setProperty("/createRefernceEnable", false);
			this.getView().byId("iconTabId").setSelectedKey("01");
		},
		
		//Close Dialog for Reference GTIN
		onCancelRefGtinCheck : function(){
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/ideationDto/upc","");
			this._refGtinCheckDialog.close();
		},
		
		//Select Reference GTIN type
		onRefGtinSelect : function(oEvent){
			var oDashboardTabModel = this.oDashboardTabModel;
			var selectedIndex = oEvent.getSource().getSelectedIndex();
			if(selectedIndex === 0){
				oDashboardTabModel.setProperty("/skuType","REACTIVATE_SKU");
			} else if(selectedIndex === 1){
				oDashboardTabModel.setProperty("/skuType","SEASONAL_SKU");
			} else if(selectedIndex === 2){
				oDashboardTabModel.setProperty("/skuType","OTHER_SKU");
			}
		},
		
		onOKRefGtinCheck : function(){
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			if(oDashboardTabModel.getProperty("/skuType") === "REACTIVATE_SKU"){
				oDashboardVisibilityModel.setProperty("/reactivationSku",true);
			} else {
				oDashboardVisibilityModel.setProperty("/reactivationSku",false);
			}
		},
		
		//Function to set values in mini-wts and dims on select of GDSN hierarchy
		onSelectGDSNHierarchy: function(oEvent){
			var oDashboardTabModel = this.oDashboardTabModel;
			var oIdeationHierachiesPopUp = this.oIdeationHierachiesPopUp;
			var sPath = oEvent.getParameters()["rowContext"].sPath;
			var selectedHierarchy = oIdeationHierachiesPopUp.getProperty(sPath);
			var gtinEA = oIdeationHierachiesPopUp.getProperty(sPath + "/gtinEA");
			var gtinIN = oIdeationHierachiesPopUp.getProperty(sPath + "/gtinIN");
			var gtinCS = oIdeationHierachiesPopUp.getProperty(sPath + "/gtinCS");
			var individualPackageCountEA = oIdeationHierachiesPopUp.getProperty(sPath + "/individualPackageCountEA"); //To be available from service
			var individualPackageSizeEA = oIdeationHierachiesPopUp.getProperty(sPath + "/individualPackageSizeEA"); //To be available from service
			var noOfIndividualPackageIN = oIdeationHierachiesPopUp.getProperty(sPath + "/eaPerIN");
			var noOfIndividualInnersPerCS = oIdeationHierachiesPopUp.getProperty(sPath + "/inPerCs");
			var noOfIndividualPackagesPerCS = oIdeationHierachiesPopUp.getProperty(sPath + "/eaPerCs");
			
			oDashboardTabModel.setProperty("/ideationDto/gtinEA", gtinEA);
			oDashboardTabModel.setProperty("/ideationDto/gtinIN", gtinIN);
			oDashboardTabModel.setProperty("/ideationDto/gtinCS", gtinCS);
			oDashboardTabModel.setProperty("/ideationDto/individualPackageCountEA", individualPackageCountEA);
			oDashboardTabModel.setProperty("/ideationDto/individualPackageSizeEA", individualPackageSizeEA);
			oDashboardTabModel.setProperty("/ideationDto/noOfIndividualPackageIN", noOfIndividualPackageIN);
			oDashboardTabModel.setProperty("/ideationDto/noOfIndividualInnersPerCS", noOfIndividualInnersPerCS);
			oDashboardTabModel.setProperty("/ideationDto/noOfIndividualPackagesPerCS", noOfIndividualPackagesPerCS);
			oDashboardTabModel.refresh();
		},
		
		//Function to re-set the values set in mini-wts and dims
		onCancelIdeationTab: function(){
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/ideationDto/gtinEA", "");
			oDashboardTabModel.setProperty("/ideationDto/gtinIN", "");
			oDashboardTabModel.setProperty("/ideationDto/gtinCS", "");
			
			var gtinType = oDashboardTabModel.getProperty("/ideationDto/gtinType");
			if(gtinType === "EA"){
				var gtinEA = oDashboardTabModel.getProperty("/ideationDto/gtinEA");
				oDashboardTabModel.setProperty("/ideationDto/gtinEA", gtinEA);
			} else if(gtinType === "PK"){
				var gtinIN = oDashboardTabModel.getProperty("/ideationDto/gtinIN");
				oDashboardTabModel.setProperty("/ideationDto/gtinEA", gtinIN);
			} else if(gtinType === "CS"){
				var gtinCS = oDashboardTabModel.getProperty("/ideationDto/gtinCS");
				oDashboardTabModel.setProperty("/ideationDto/gtinEA", gtinCS);
			}
			oDashboardTabModel.setProperty("/ideationDto/individualPackageCountEA", "");
			oDashboardTabModel.setProperty("/ideationDto/individualPackageSizeEA", "");
			oDashboardTabModel.setProperty("/ideationDto/noOfIndividualPackageIN", "");
			oDashboardTabModel.setProperty("/ideationDto/noOfIndividualInnersPerCS", "");
			oDashboardTabModel.setProperty("/ideationDto/noOfIndividualPackagesPerCS", "");
			oDashboardTabModel.refresh();
			oEvent.getSource().getParent().close();
		},
		
		//Function to close save/submit error message pop-up
		closeErrorMsgPopUp: function(oEvent){
			//this.loadDashboardData("1");
			oEvent.getSource().getParent().close();
		},
		
		//Function to set SAP Product Description
		setSAPProductDesc: function(){
			
			var oDropdownModel = this.oDropdownModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var desc = oDashboardTabModel.getProperty("/ideationDto/description");
			desc = desc.substr(0,20);
			var brand = oDashboardTabModel.getProperty("/ideationDto/brand");
			brand = brand.substr(0,10);
			var packageCount = oDashboardTabModel.getProperty("/ideationDto/packageCount");
			var packageType = oDashboardTabModel.getProperty("/ideationDto/packageType");
			var individualPackageSize = oDashboardTabModel.getProperty("/ideationDto/individualPackageSize");
			var individualPackageSizeUom = oDashboardTabModel.getProperty("/ideationDto/individualPackageSizeUom");
			
			if(desc && brand){
				if(packageType){
					var packType = oDropdownModel.getProperty("/packageTypeList");
					packageType = util.getSelectedValue(packType, packageType);
				}
				if(individualPackageSizeUom){
					var packSizeUom = oDropdownModel.getProperty("/packageSizeUOMList");
					individualPackageSizeUom = util.getSelectedValue(packSizeUom, individualPackageSizeUom);
				}
				var sapProdDesc = desc + " " + brand + " " + packageCount + packageType + " " +
					individualPackageSize + individualPackageSizeUom;
				oDashboardTabModel.setProperty("/ideationDto/sapProductDescription", sapProdDesc);
				oDashboardTabModel.refresh();
			}
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<IDEATION_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//		

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BASIC_ATTRIUTES_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		onGuaranteedDysFresh: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var value = oDashboardTabModel.getProperty("/basicAttributeDto/guaranteedDaysFreshToCustomer");
			var totalShelfLife = oDashboardTabModel.getProperty("/basicAttributeDto/totalShelfLife");
			var minShelfLife = oDashboardTabModel.getProperty("/basicAttributeDto/minimumShelfLifeRequiredUponReceipt");
			var priMinShelfLife = oDashboardTabModel.getProperty("/basicAttributeDto/priSrcMinShelfLifeReqUponReceipt");
			var secMinShelfLife = oDashboardTabModel.getProperty("/basicAttributeDto/secSrcMinShelfLifeReqUponReceipt");
			if (parseInt(value) > totalShelfLife || parseInt(value) > minShelfLife || parseInt(value) > priMinShelfLife || parseInt(value) >
				secMinShelfLife) {
				var errorText = "Guaranteed days to fresh should be less than Shelf life";
				util.toastMessage(errorText);
				oDashboardTabModel.setProperty("/basicAttributeDto/guaranteedDaysFreshToCustomer", "");
			}
		},

		onJuiceAlcoholChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var value = oEvent.getSource().getValue();
			var oValue = value.split("%")[0];
			if (parseInt(oValue) > 100) {
				var errorText = "Percentage cannot exceed 100";
				util.toastMessage(errorText);
				oEvent.getSource().setValue("");
			} else {
				var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;
				oDashboardTabModel.setProperty(sPath, value);
			}
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BASIC_ATTRIUTES_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<WTS_DIMS_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function To Set Hierarchy Value in Hierarchy Column
		setHierarchiesLevel: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var wgtDimData = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			for (var i = 0; i < wgtDimData.length; i++) {
				var hValue = i + 1;
				wgtDimData[i].hierarchy = "H" + hValue;
			}
			oDashboardTabModel.refresh();
		},

		//Function To Create Object Of Combination Of Hierarchy and EA/CS
		createHierarchiesObj: function() {
			var oTempArr = [];
			var oDropdownModel = this.oDropdownModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var wgtDimData = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			if (wgtDimData.length) {
				for (var i = 0; i < wgtDimData.length; i++) {
					var key = wgtDimData[i].hierarchy;
					var eaPerCSVal = wgtDimData[i].eachPerCS;
					var hierarchy = key + " - " + eaPerCSVal + " EA/CS";
					var oTempObj = {
						"key": key,
						"value": hierarchy
					};
					oTempArr.push(oTempObj);
				}
				oDropdownModel.setProperty("/hierarchyUnitDropDown", oTempArr);
				oDashboardVisibilityModel.setProperty("/costSheetGtinEaEditable", false);
				oDashboardVisibilityModel.setProperty("/costSheetGtinCsEditable", false);
				oDashboardVisibilityModel.setProperty("/costSheetEACSEditable", false);
				oDashboardVisibilityModel.setProperty("/costSheetBtlPerEaEditable", false);
			}else{
				oDashboardVisibilityModel.setProperty("/costSheetGtinEaEditable", true);
				oDashboardVisibilityModel.setProperty("/costSheetGtinCsEditable", true);
				oDashboardVisibilityModel.setProperty("/costSheetEACSEditable", true);
				oDashboardVisibilityModel.setProperty("/costSheetBtlPerEaEditable", true);
			}
			oDropdownModel.refresh();
			oDashboardTabModel.refresh();
			oDashboardVisibilityModel.refresh();
		},

		// Function To set Visibility of WTS_DIMS tab on load first time
		setVisibilityOfWTSDIMTableColmn: function(oEvent) {
			var oWeightDimsVisibleModel = this.oWeightDimsVisibleModel;
			var title = this.oResourceModel.getText("EACH_INNER_CASE_PALLET");
			oWeightDimsVisibleModel.setProperty("/title", title);
			oWeightDimsVisibleModel.setProperty("/eachUnit", true);
			oWeightDimsVisibleModel.setProperty("/innerUnit", true);
			oWeightDimsVisibleModel.setProperty("/caseUnit", true);
			oWeightDimsVisibleModel.setProperty("/palletUnit", true);
			oWeightDimsVisibleModel.refresh();
		},

		//Function To Set Table Column According to selected Unit
		onChangeUnits: function(oEvent) {
			var oDropdownModel = this.oDropdownModel;
			var oWeightDimsVisibleModel = this.oWeightDimsVisibleModel;
			var key = oEvent.getSource().getSelectedKey();
			oDropdownModel.setProperty("/selectChangeUnitKey", key);
			this.setUCNavIconEditable();
			this.weightsDimsColVisible(key);
		},

		//Function To set Weights & Dims Table Column Visible Property
		weightsDimsColVisible: function(key) {
			var oWeightDimsVisibleModel = this.oWeightDimsVisibleModel;
			if (key === "ALL") {
				var title = this.oResourceModel.getText("EACH_INNER_CASE_PALLET");
				oWeightDimsVisibleModel.setProperty("/title", title);
				oWeightDimsVisibleModel.setProperty("/eachUnit", true);
				oWeightDimsVisibleModel.setProperty("/innerUnit", true);
				oWeightDimsVisibleModel.setProperty("/caseUnit", true);
				oWeightDimsVisibleModel.setProperty("/palletUnit", true);
			} else if (key === "EACH") {
				var title = this.oResourceModel.getText("EACH");
				oWeightDimsVisibleModel.setProperty("/title", title);
				oWeightDimsVisibleModel.setProperty("/eachUnit", true);
				oWeightDimsVisibleModel.setProperty("/innerUnit", false);
				oWeightDimsVisibleModel.setProperty("/caseUnit", false);
				oWeightDimsVisibleModel.setProperty("/palletUnit", false);
			} else if (key === "INNER") {
				var title = this.oResourceModel.getText("INNER");
				oWeightDimsVisibleModel.setProperty("/title", title);
				oWeightDimsVisibleModel.setProperty("/eachUnit", false);
				oWeightDimsVisibleModel.setProperty("/innerUnit", true);
				oWeightDimsVisibleModel.setProperty("/caseUnit", false);
				oWeightDimsVisibleModel.setProperty("/palletUnit", false);
			} else if (key === "CASE") {
				var title = this.oResourceModel.getText("CASE");
				oWeightDimsVisibleModel.setProperty("/title", title);
				oWeightDimsVisibleModel.setProperty("/eachUnit", false);
				oWeightDimsVisibleModel.setProperty("/innerUnit", false);
				oWeightDimsVisibleModel.setProperty("/caseUnit", true);
				oWeightDimsVisibleModel.setProperty("/palletUnit", false);
			} else {
				var title = this.oResourceModel.getText("PALLET");
				oWeightDimsVisibleModel.setProperty("/title", title);
				oWeightDimsVisibleModel.setProperty("/eachUnit", false);
				oWeightDimsVisibleModel.setProperty("/innerUnit", false);
				oWeightDimsVisibleModel.setProperty("/caseUnit", false);
				oWeightDimsVisibleModel.setProperty("/palletUnit", true);
			}
			oWeightDimsVisibleModel.refresh();
		},

		// Function to Add the Hierarchy Row
		onAddHierarchy: function(oEvent) {
			var that = this;
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var empRowDataObj = skuTempObjectModel.getProperty("/weightsAndDimsDto");
			var empRowData = jQuery.extend(true, {}, empRowDataObj);
			var existTableData = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			if (existTableData.length) {
				var lastRow = existTableData[existTableData.length - 1];
				var bVal = this.checkIsAllRecordFill(lastRow);
				if (bVal) { //if bVal is true then we can add new Row
					existTableData.push(empRowData);
				} else {
					var errorText = that.oResourceModel.getText("PLEASE_FILL_ALL_MANDATORY_FIELD");
					util.toastMessage(errorText);
				}
			} else {
				existTableData.push(empRowData);
			}
			this.setHierarchiesLevel();
			oDashboardTabModel.refresh();
		},

		//Function To Check is last row all field are filled or not
		checkIsAllRecordFill: function(lastRow) {
			var count = 0;
			if (lastRow.bottlePerEA === "" || lastRow.bottlePerEA === null) {
				count++;
			}
			if (lastRow.casePerPAL === "" || lastRow.casePerPAL === null) {
				count++;
			}
			if (lastRow.depthCS === "" || lastRow.depthCS === null) {
				count++;
			}
			if (lastRow.depthEA === "" || lastRow.depthEA === null) {
				count++;
			}
			if (lastRow.depthIN === "" || lastRow.depthIN === null) {
				count++;
			}
			if (lastRow.depthPAL === "" || lastRow.depthPAL === null) {
				count++;
			}
			if (lastRow.depthUomCS === "" || lastRow.depthUomCS === null) {
				count++;
			}
			if (lastRow.depthUomEA === "" || lastRow.depthUomEA === null) {
				count++;
			}
			if (lastRow.depthUomIN === "" || lastRow.depthUomIN === null) {
				count++;
			}
			if (lastRow.depthUomPAL === "" || lastRow.depthUomPAL === null) {
				count++;
			}
			if (lastRow.eachPerCS === "" || lastRow.eachPerCS === null) {
				count++;
			}
			if (lastRow.eachPerIN === "" || lastRow.eachPerIN === null) {
				count++;
			}
			/*if(lastRow.bottlePerIN === ""||lastRow.bottlePerIN === null){
				count++;
			}*/
			if (lastRow.grossWTCS === "" || lastRow.grossWTCS === null) {
				count++;
			}
			if (lastRow.grossWTEA === "" || lastRow.grossWTEA === null) {
				count++;
			}
			if (lastRow.grossWTIN === "" || lastRow.grossWTIN === null) {
				count++;
			}
			if (lastRow.grossWTPAL === "" || lastRow.grossWTPAL === null) {
				count++;
			}
			if (lastRow.grossWTUomCS === "" || lastRow.grossWTUomCS === null) {
				count++;
			}
			if (lastRow.grossWTUomEA === "" || lastRow.grossWTUomEA === null) {
				count++;
			}
			if (lastRow.grossWTUomIN === "" || lastRow.grossWTUomIN === null) {
				count++;
			}
			if (lastRow.grossWTUomPAL === "" || lastRow.grossWTUomPAL === null) {
				count++;
			}
			if (lastRow.gtinCS === "" || lastRow.gtinCS === null) {
				count++;
			}
			if (lastRow.gtinEA === "" || lastRow.gtinEA === null) {
				count++;
			}
			if (lastRow.gtinIN === "" || lastRow.gtinIN === null) {
				count++;
			}
			if (lastRow.gtinPAL === "" || lastRow.gtinPAL === null) {
				count++;
			}
			if (lastRow.heightCS === "" || lastRow.heightCS === null) {
				count++;
			}
			if (lastRow.heightEA === "" || lastRow.heightEA === null) {
				count++;
			}
			if (lastRow.heightIN === "" || lastRow.heightIN === null) {
				count++;
			}
			if (lastRow.heightPAL === "" || lastRow.heightPAL === null) {
				count++;
			}
			if (lastRow.hierarchy === "" || lastRow.hierarchy === null) {
				count++;
			}
			if (lastRow.highPAL === "" || lastRow.highPAL === null) {
				count++;
			}
			if (lastRow.innerPerCS === "" || lastRow.innerPerCS === null) {
				count++;
			}
			if (lastRow.netContentEA === "" || lastRow.netContentEA === null) {
				count++;
			}
			if (lastRow.netContentUomEA === "" || lastRow.netContentUomEA === null) {
				count++;
			}
			if (lastRow.netContentEA === "" || lastRow.netContentEA === null) {
				count++;
			}
			if (lastRow.tiePAL === "" || lastRow.tiePAL === null) {
				count++;
			}
			if (lastRow.variableCS === "" || lastRow.variableCS === null) {
				count++;
			}
			if (lastRow.variableEA === "" || lastRow.variableEA === null) {
				count++;
			}
			if (lastRow.variableIN === "" || lastRow.variableIN === null) {
				count++;
			}
			if (lastRow.weightCS === "" || lastRow.weightCS === null) {
				count++;
			}
			if (lastRow.weightEA === "" || lastRow.weightEA === null) {
				count++;
			}
			if (lastRow.weightIN === "" || lastRow.weightIN === null) {
				count++;
			}
			if (lastRow.weightPAL === "" || lastRow.weightPAL === null) {
				count++;
			}

			if (count === 0) {
				return true;
			} else {
				return false;
			}
		},

		//Function To Delete Hierarchy Row
		onDeleteHierarchyRow: function(oEvent) {
			var that = this;
			var sPath = oEvent.getSource().getParent().getBindingContext("oDashboardTabModel").getPath();
			var messageBox = jQuery.sap.require("sap.m.MessageBox");
			var oConfirmMsg = this.oResourceModel.getText("CONFIRM_MSG_ON_DELETE");
			sap.m.MessageBox.confirm(oConfirmMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				onClose: function(oAction) {
					if (oAction === "OK") {
						var oDashboardTabModel = that.oDashboardTabModel;
						oDashboardTabModel.setProperty(sPath+"/isDeleted", true);
			var existTableData = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
						var oBeforeDeletionWeigtDimsDto = jQuery.extend(true, [], existTableData);
						oDashboardTabModel.setProperty("/beforeDeletionWeigtDimsDto",oBeforeDeletionWeigtDimsDto);
			var sPathSplit = sPath.split("/");
			var selectedIndex = sPathSplit[sPathSplit.length - 1];
			existTableData.splice(selectedIndex, 1);
			//this.setHierarchiesLevel();
			oDashboardTabModel.refresh();
					}
				}
			});
		},

		//Function To Calculate Value of bottlePerInner and eachPerCS and eachPerPAL on change of bottlePerEach value
		onChangeBottlePerEach: function(oEvent) {

			var selRowIndex = oEvent.getSource().getParent().getIndex();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oArray = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			var selRowData = oArray[selRowIndex];
			var bottlePerEachValue = oEvent.getParameter("value");

			var eachPerINVal = selRowData.eachPerIN;
			var bottletlPerINVal = bottlePerEachValue * eachPerINVal;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/bottlePerIN", bottletlPerINVal.toString());

			var innerPerCSVal = selRowData.innerPerCS;
			var eachPerCSVal = innerPerCSVal * eachPerINVal;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerCS", eachPerCSVal.toString());

			var casePerPALValue = selRowData.casePerPAL;
			var eachPerPALVal = casePerPALValue * eachPerCSVal;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerPAL", eachPerPALVal.toString());
			oDashboardTabModel.refresh();
		},

		//Function To Calculate Value of bottlePerInner and eachPerCS and eachPerPAL on change of eachPerInner value
		onChangeEachPerInner: function(oEvent) {
			var selRowIndex = oEvent.getSource().getParent().getIndex();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oArray = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			var selRowData = oArray[selRowIndex];
			var eachPerINValue = oEvent.getParameter("value");

			var bottlePerEAValue = selRowData.bottlePerEA;
			var bottlePerINValue = bottlePerEAValue * eachPerINValue;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/bottlePerIN", bottlePerINValue.toString());

			var innerPerCSValue = selRowData.innerPerCS;
			var eachPerCSValue = innerPerCSValue * eachPerINValue;
			this.oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerCS", eachPerCSValue.toString());

			var casePerPALValue = selRowData.casePerPAL;
			var eachPerPALValue = casePerPALValue * eachPerCSValue;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerPAL", eachPerPALValue.toString());
			oDashboardTabModel.refresh();
		},

		//Function To Calculate Value of eachPerCS and eachPerPAL on change of InnerPerCS value
		onChangeInnerPerCs: function(oEvent) {
			var selRowIndex = oEvent.getSource().getParent().getIndex();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oArray = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			var selRowData = oArray[selRowIndex];
			var innerPerCSValue = oEvent.getParameter("value");

			var eachPerINValue = selRowData.eachPerIN;
			var eachPerCSValue = innerPerCSValue * eachPerINValue;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerCS", eachPerCSValue.toString());

			var casePerPALValue = selRowData.casePerPAL;
			var eachPerPALValue = casePerPALValue * eachPerCSValue;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerPAL", eachPerPALValue, toString());
			oDashboardTabModel.refresh();
		},

		//Function To Calculate Value of eachPerPAL on change of casePerPAL value
		onChangeCasePerPAL: function(oEvent) {
			var selRowIndex = oEvent.getSource().getParent().getIndex();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oArray = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			var selRowData = oArray[selRowIndex];
			var casePerPALValue = oEvent.getParameter("value");

			var eachPerCSValue = selRowData.eachPerCS;
			var eachPerPALValue = casePerPALValue * eachPerCSValue;
			oDashboardTabModel.setProperty("/weightsAndDimsDtos/" + selRowIndex + "/eachPerPAL", eachPerPALValue.toString());
			oDashboardTabModel.refresh();
		},

		//Function To press Change Unit Navigation Icon
		onPressChangeUnitNav: function(oEvent) {
			var iconPressed = oEvent.getSource().getIcon();
			var oDropdownModel = this.oDropdownModel;
			var changeUnitData = oDropdownModel.getProperty("/unitDropDown");
			var selectChangeUnitKey = oDropdownModel.getProperty("/selectChangeUnitKey");
			for (var i = 0; i < changeUnitData.length; i++) {
				if (changeUnitData[i].key === selectChangeUnitKey) {
					var selectKeyIndex = i;
				}
			}
			if (iconPressed === "sap-icon://navigation-left-arrow") {
				selectChangeUnitKey = changeUnitData[selectKeyIndex - 1].key;
				oDropdownModel.setProperty("/selectChangeUnitKey", selectChangeUnitKey);
				this.setUCNavIconEditable();
			}
			if (iconPressed === "sap-icon://navigation-right-arrow") {
				selectChangeUnitKey = changeUnitData[selectKeyIndex + 1].key;
				oDropdownModel.setProperty("/selectChangeUnitKey", selectChangeUnitKey);
				this.setUCNavIconEditable();
			}
		},

		//Function to set Unit Change Navigation Editable 
		setUCNavIconEditable: function() {
			var oDropdownModel = this.oDropdownModel;
			var selectChangeUnitKey = oDropdownModel.getProperty("/selectChangeUnitKey");
			if (selectChangeUnitKey === "ALL") {
				oDropdownModel.setProperty("/previousButtonEnabled", false);
				oDropdownModel.setProperty("/nextButtonEnabled", true);
			} else if (selectChangeUnitKey === "PALLET") {
				oDropdownModel.setProperty("/previousButtonEnabled", true);
				oDropdownModel.setProperty("/nextButtonEnabled", false);
			} else {
				oDropdownModel.setProperty("/previousButtonEnabled", true);
				oDropdownModel.setProperty("/nextButtonEnabled", true);
			}
			oDropdownModel.refresh();
			this.weightsDimsColVisible(selectChangeUnitKey);
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<WTS_DIMS_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<PRODUCT_SOURCE_TAB_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<SOURCING_TAB_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to add new source
		onAddSource: function(oEvent) {
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var tempSourceInfoDto = skuTempObjectModel.getProperty("/sourceInfoDtos/0");
			var sourceInfoObject = jQuery.extend(true, {}, tempSourceInfoDto);
			sourceInfoObject.isSelectedSrcVisible = true;
			var oDashboardTabmodel = this.oDashboardTabModel;
			var sourceInfoDtos = oDashboardTabmodel.getProperty("/sourceInfoDtos");
			if (!sourceInfoDtos) {
				sourceInfoDtos = [];
			}
			var sourceInfoDtosLen = sourceInfoDtos.length;
			this.sourceInfoPath = parseInt(sourceInfoDtosLen);

			sourceInfoDtos.filter(function(obj) {
				obj.isSelectedSrcVisible = false;
			});
			if (sourceInfoDtosLen === 0 || sourceInfoDtosLen === undefined) {
				/*sourceInfoObject.primaryVisible = false;
				sourceInfoObject.secondaryVisible = false;*/
				sourceInfoObject.sourceInfoDto.type = "Primary";
			} else if (sourceInfoDtosLen === 1) {
				/*sourceInfoObject.secondaryVisible = false;*/
				sourceInfoObject.sourceInfoDto.type = "Secondary";
			}else{
				sourceInfoObject.sourceInfoDto.type = "Others";
			}

			sourceInfoDtos.push(sourceInfoObject);
			oDashboardTabmodel.refresh();
			oDashboardVisibilityModel.setProperty("/sourcingButtonVisible", true);
			skuTempObjectModel.setProperty("/sourcingButton", "Add");
			this.onCostingUOMChange();
			this.flipSourceViews(oEvent);
		},
		
		cancelNewSource:function(){
			var sourceInfoPath = this.sourceInfoPath;
			var oDashboardTabModel = this.oDashboardTabModel;
			var sourceInfoDtos = oDashboardTabModel.getProperty("/sourceInfoDtos");
			sourceInfoDtos.splice(sourceInfoPath, 1);
			oDashboardTabModel.refresh();
			this.flipSourceViews();
		},
		
		onCancelPress: function(){
			var oResourceModel = this.oResourceModel;
			var errorText = oResourceModel.getText("ARE_YOU_SURE_YOU_WANT_TO_CANCEL_CHANGES");
			util.toastMessageAction(errorText, this);
		},

		//Function to flip source list view to source detail view
		flipSourceViews: function(evt) {
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var navCon = sap.ui.getCore().byId("MM_NAV_CONTAINER");
			var target;
			if(evt){
				target = evt.getSource().data("target");
			var sourceButtton = evt.getSource().getText();
			var sourceInfoPath = this.sourceInfoPath;
			if(sourceButtton === "Add")	{
				var oDashboardTabModel = this.oDashboardTabModel;
				var vendorNumber = oDashboardTabModel.getProperty("/sourceInfoDtos/"+sourceInfoPath+"/sourceInfoDto/vendorNumber");
				var vendorName = oDashboardTabModel.getProperty("/sourceInfoDtos/"+sourceInfoPath+"/sourceInfoDto/vendorName");
				if(vendorNumber === "" || vendorName === ""){
					var oResourceModel = this.oResourceModel;
					var errorText = oResourceModel.getText("PLEASE_ENTER_VENDOR_NUMBER_OR_VENDOR_NAME");
					util.toastMessage(errorText);
					return;
				}
			}
			}else{
				target="MM_VIEW_SOURCES";
			}
			if (target) {
				navCon.to(sap.ui.getCore().byId(target), "flip");
			} else {
				navCon.back();
			}
			if (target === "MM_SOURCE_DETAILS") {
				oDashboardVisibilityModel.setProperty("/viewSourcesVisible", true);
				oDashboardVisibilityModel.setProperty("/addSourceVisible", false);
				oDashboardVisibilityModel.setProperty("/addDistributerVisible", false);
				oDashboardVisibilityModel.setProperty("/soleSourcedProductVisible", false);
				oDashboardVisibilityModel.setProperty("/tabCancelBtnVisible", false);
				oDashboardVisibilityModel.setProperty("/tabSaveBtnVisible", false);
				oDashboardVisibilityModel.setProperty("/tabSubmitBtnVisible", false);
				oDashboardVisibilityModel.setProperty("/viewSourceBtnEnabled", false);
			} else {
				oDashboardVisibilityModel.setProperty("/viewSourcesVisible", false);
				oDashboardVisibilityModel.setProperty("/addSourceVisible", true);
				oDashboardVisibilityModel.setProperty("/addDistributerVisible", true);
				oDashboardVisibilityModel.setProperty("/soleSourcedProductVisible", true);
				oDashboardVisibilityModel.setProperty("/tabCancelBtnVisible", true);
				oDashboardVisibilityModel.setProperty("/tabSaveBtnVisible", true);
				oDashboardVisibilityModel.setProperty("/tabSubmitBtnVisible", true);
				oDashboardVisibilityModel.setProperty("/viewSourceBtnEnabled", true);

			}
		},
		
		onCancelNewSource: function() {
			var oResourceModel = this.oResourceModel;
			var errorText = oResourceModel.getText("ARE_YOU_SURE_YOU_WANT_TO_CANCEL_CHANGES");
			util.toastMessage(errorText);
		},

		//Function to open pop-up having list of distributors
		onOpenDistributor: function() {

		},

		//Function to close distributor pop-up
		onCloseSourceDistributorPopup: function() {

		},
		
		//Function to add selected distributor from pop-up to source list view
		addDistributorToSourceList: function() {

		},
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<SOURCING_TAB-END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<VIEW_SOURCE_TABLE_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//Function to display Selected sources 
		showSelectedSrcDetails: function(oEvent) {
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var sPath = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
			var oSources = oDashboardTabModel.getProperty("/sourceInfoDtos");
			if (!oSources) {
				oSources = [];
			}
			oSources.filter(function(obj) {
				obj.isSelectedSrcVisible = false;
			});
			this.sourceInfoPath = parseInt(sPath.slice(sPath.length - 1));
			var oCurrentObj = oDashboardTabModel.getProperty(sPath);
			oCurrentObj.isSelectedSrcVisible = true;
			oDashboardTabModel.refresh();

			var navCon = sap.ui.getCore().byId("MM_NAV_CONTAINER");
			var target = "MM_SOURCE_DETAILS";
			if (target) {
				navCon.to(sap.ui.getCore().byId(target), "flip");
			} else {
				navCon.back();
			}
			if (target === "MM_SOURCE_DETAILS") {
				oDashboardVisibilityModel.setProperty("/viewSourcesVisible", true);
				oDashboardVisibilityModel.setProperty("/addSourceVisible", false);
				oDashboardVisibilityModel.setProperty("/addDistributerVisible", false);
				oDashboardVisibilityModel.setProperty("/soleSourcedProductVisible", false);
			} else {
				oDashboardVisibilityModel.setProperty("/viewSourcesVisible", false);
				oDashboardVisibilityModel.setProperty("/addSourceVisible", true);
				oDashboardVisibilityModel.setProperty("/addDistributerVisible", true);
				oDashboardVisibilityModel.setProperty("/soleSourcedProductVisible", true);

			}
			
			oDashboardVisibilityModel.setProperty("/sourcingButtonVisible", true);
			skuTempObjectModel.setProperty("/sourcingButton", "Save");
			this.onCostingUOMChange();
		},
		
		//Function to delete sources from source list view
		onSourceDeletion: function(oEvent) {
			var that = this;
			var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
			var messageBox = jQuery.sap.require("sap.m.MessageBox");
			var oConfirmMsg = this.oResourceModel.getText("CONFIRM_MSG_ON_DELETE");
			sap.m.MessageBox.confirm(oConfirmMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				onClose: function(oAction) {
					if (oAction === "OK") {
						var oDashboardTabModel = that.oDashboardTabModel;
						oDashboardTabModel.setProperty(path+"/isDeleted", true);
						oDashboardTabModel.setProperty(path+"/sourceInfoDto/isDeleted", true);
			var sourceInfoDtos = oDashboardTabModel.getProperty("/sourceInfoDtos");
						var oBeforeDeletionPrdctSrcDto = jQuery.extend(true, [], sourceInfoDtos);
						oDashboardTabModel.setProperty("/beforeDeletionPrdctSrcDto",oBeforeDeletionPrdctSrcDto);
			var parts = path.split("/")[2];
			sourceInfoDtos.splice(parts, 1);
			oDashboardTabModel.setProperty("/sourceInfoDtos/0/sourceInfoDto/type", "Primary");
			oDashboardTabModel.setProperty("/sourceInfoDtos/1/sourceInfoDto/type", "Secondary");
			oDashboardTabModel.refresh();
					}
				}
			});
		},
		
		//Function to promote or de-promote sources
		onPromoteSource: function(oEvent) {
			var sButtonText = oEvent.getSource().getText();
			var oDashboardTabModel = this.oDashboardTabModel;
			var sourceInfoDtos = oDashboardTabModel.getProperty("/sourceInfoDtos");
			var sPath = oEvent.getSource().getParent().getParent().getBindingContext("oDashboardTabModel").getPath();
			var sPathSplit = sPath.split("/");
			var selectedIndex = parseInt(sPathSplit[sPathSplit.length-1]);
			if (sButtonText === "Primary") {
				oDashboardTabModel.setProperty(sPath+"/sourceInfoDto/type", "Primary");
				oDashboardTabModel.setProperty("/sourceInfoDtos/0/sourceInfoDto/type", "Secondary");
				oDashboardTabModel.setProperty("/sourceInfoDtos/1/sourceInfoDto/type", "Other");
				var selectedRowData = sourceInfoDtos[selectedIndex];
				sourceInfoDtos.splice(selectedIndex, 1);
				sourceInfoDtos.splice(0, 0, selectedRowData);
				oDashboardTabModel.refresh();
			} else if(sButtonText === "Secondary") {
				oDashboardTabModel.setProperty(sPath+"/sourceInfoDto/type", "Secondary");
				oDashboardTabModel.setProperty("/sourceInfoDtos/1/sourceInfoDto/type", "Other");
				var selectedRowData = sourceInfoDtos[selectedIndex];
				sourceInfoDtos.splice(selectedIndex, 1);
				sourceInfoDtos.splice(1, 0, selectedRowData);
				oDashboardTabModel.refresh();
			}else{
				var nextIndex = selectedIndex+1;
				oDashboardTabModel.setProperty(sPath+"/sourceInfoDto/type", "Others");
				oDashboardTabModel.setProperty("/sourceInfoDtos/"+nextIndex+"/sourceInfoDto/type", "Secondary");
				var selectedRowData = sourceInfoDtos[selectedIndex];
				sourceInfoDtos.splice(selectedIndex, 1);
				sourceInfoDtos.splice(2, 0, selectedRowData);
				oDashboardTabModel.refresh();
			}
			oDashboardTabModel.refresh();
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<VIEW_SOURCE_TABLE_END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<SOURCE_INFO_DETAIL_PANEL_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		getSearchVendorNumber:function(oEvent){	
			dropdownServices.getSearchVendorNumber(oEvent, this);
		},
		
		onSelectVenSuggesion: function(oEvent){
			var src = oEvent.getSource();
			var oDashboardTabModel = this.oDashboardTabModel;
			var selText = oEvent.getParameters().selectedItem.getText();
			var selAddText = oEvent.getParameters().selectedItem.getAdditionalText();
			var sPath = oEvent.getSource().getBindingContext("oDashboardTabModel");
			oDashboardTabModel.setProperty(sPath + "/sourceInfoDto/vendorNumber", selText);
			oDashboardTabModel.setProperty(sPath + "/sourceInfoDto/vendorName", selAddText);
			oDashboardTabModel.refresh();
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<SOURCE_INFO_DETAIL_PANEL-END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ORDERING_INFO_PANEL_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//Function To Set Binning UnitPerCase Value on Change of Sourcing UnitPerCase
		onChangeSourceUnitPerCs: function(oEvent) {
			var oValue = oEvent.getSource().getValue();
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/binningDto/unitPerCase", oValue);
			oDashboardTabModel.refresh();
		},

		//Function To Set Binning CasesPerPallet Value on Change of Sourcing CasesPerPallet
		onChangeSourceCasePerPAL: function(oEvent) {
			var oValue = oEvent.getSource().getValue();
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/binningDto/casesPerPallet", oValue);
			oDashboardTabModel.refresh();
		},

		//Function To Set Binning MinItemOrderQuantity Value on Change of Sourcing MinItemOrderQuantity
		onChangeSourceMinItemQuan: function(oEvent) {
			var oValue = oEvent.getSource().getValue();
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/binningDto/minItemOrderQuantity", oValue);
			oDashboardTabModel.refresh();
		},
		
		//Function to select country
		onCountrySelect: function(oEvent) {
			var selectedCountry = oEvent.getSource().getSelectedKey();
			dropdownServices.getStateList(this, selectedCountry);
			var oEventSource = oEvent.getSource().getCustomData()[0].getValue();
			if(oEventSource === "TABLE"){
				var sPath = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath();
				var index = sPath.split("/")[2];
				if(index === "0"){
					this.onChange();
				}
			}
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ORDERING_INFO_PANEL-END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<COSTSHEET_PANEL_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function To Set Value of GTIN_CS and GTIN_EA on Selection of Hierarchy
		onChangeCSHierarchy: function(oEvent) {
			var selKey = oEvent.getSource().getSelectedKey();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var sourceInfoPath = this.sourceInfoPath;
			var wgtDimData = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			for(var i = 0; i<wgtDimData.length; i++){
				if(wgtDimData[i].hierarchy === selKey){
					var gtinEaVal = wgtDimData[i].gtinEA;
					var gtinCsVal = wgtDimData[i].gtinCS;
					var bottlesPerEach = wgtDimData[i].bottlePerEA;
					var eachPerCS = wgtDimData[i].eachPerCS;
					oDashboardVisibilityModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/costSheetGtinEaValue", gtinEaVal);
					oDashboardVisibilityModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/costSheetGtinCsValue", gtinCsVal);
					oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/eachPerCase", eachPerCS);
					oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/numberOfBottlesPerEach", bottlesPerEach);
				}
			}
					oDashboardTabModel.refresh();
					this.oncostPerCS();
		},
		
		//function to get Bottle Deposit when applicable state is selected
		onApplicableStateSelect:function(oEvent){
			var applicableState = oEvent.getSource().getSelectedItem().getText();
			dropdownServices.getBottleDeposit(this,applicableState);
		},
		
		bottleDeposit: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var skuTempObjectModel = this.skuTempObjectModel;
			var sourceInfoPath = this.sourceInfoPath;
			var bottlePerEach = oDashboardTabModel.getProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/numberOfBottlesPerEach");
			var eachPerCase = oDashboardTabModel.getProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/eachPerCase");
			var costingUOM = oDashboardTabModel.getProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/costUOM");
			var bottleDeposit, bottleDepositPerEach;
			var depositPerBottle = skuTempObjectModel.getProperty("/bottleDeposits/0/bottleDepositValue");
			if (costingUOM === "CS") {
				bottleDeposit = eachPerCase * bottlePerEach * depositPerBottle;
				bottleDepositPerEach = bottlePerEach * depositPerBottle;
			} else if (costingUOM === "EA") {
				bottleDeposit = bottlePerEach * depositPerBottle;
				bottleDepositPerEach = bottlePerEach * depositPerBottle;
			}
			oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/conditionTypeDtos/8/costPerCase", bottleDeposit);
			oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/conditionTypeDtos/8/pickupCostPerCase",
				bottleDeposit);
			oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/conditionTypeDtos/8/pickupCostPerEach",
				bottleDepositPerEach);
			oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/conditionTypeDtos/8/deliveryCostPerCase",
				bottleDeposit);
			oDashboardTabModel.setProperty("/sourceInfoDtos/" + sourceInfoPath + "/costSheetDto/conditionTypeDtos/8/deliveryCostPerEach",
				bottleDepositPerEach);
		},
		
		
		//Function To Set Bracket Pricing Condition
		onBracketPricingStateChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var skuTempObjectModel = this.skuTempObjectModel;
			var skuTempObjectModelData = skuTempObjectModel.getProperty("/");
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var switchState = oEvent.getSource().getState();
			costSheetDto.bracketPricingApplicable = switchState;
			var skuTempObjectModel = this.skuTempObjectModel;
			var bracketDtoClear = skuTempObjectModel.getProperty("/sourceInfoDtos/0/costSheetDto/bracketDtos");
			var conditionTypeDtoClear = skuTempObjectModel.getProperty("/sourceInfoDtos/0/costSheetDto/conditionTypeDtos");
			var bracketDtoClearData = jQuery.extend(true, [], bracketDtoClear);
			var conditionTypeDtoClearData = jQuery.extend(true, [], conditionTypeDtoClear);
			if (switchState === false) {
				skuTempObjectModel.setProperty("/bracketPricingVisibility", false);
				costSheetDto.bracketDtos = bracketDtoClearData;
				costSheetDto.conditionTypeDtos = conditionTypeDtoClearData;
				oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos[0].costPerCaseEditable = "true";
				oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos[0].costPerCaseVisible = "true";
				var scalingFactor = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].orderInfoDto.minItemOrderQuantity;

				if (scalingFactor !== undefined || scalingFactor !== "") {
					for (var i = 0; i < nonProductCostsLength; i++) {
						nonProductCosts[i].scalingFactor = scalingFactor;
						nonProductCosts[i].pickupCostPerCase = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
							nonProductCosts[i].scalingFactor))));
						nonProductCosts[i].pickupCostPerEach = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
							nonProductCosts[i].scalingFactor)) / eachPerCase));
						nonProductCosts[i].deliveryCostPerCase = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
							nonProductCosts[i].scalingFactor))));
						nonProductCosts[i].deliveryCostPerEach = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
							nonProductCosts[i].scalingFactor)) / eachPerCase));
					}
					this.netInboundCosts();
				}
			} else if (switchState === true) {
				skuTempObjectModel.setProperty("/bracketPricingVisibility", true);
				oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos[0].costPerCaseEditable = "false";
				oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos[0].costPerCaseVisible = "true";
				// bracketPricingData[0].costPerCSVisible = false;
			}
			oDashboardTabModel.refresh();
			if (oEvent) {
				this.onBackhaulBracketSelection();
				this.onNegotiatedBracketSelection();
			}

		},
        
		//Function To Set Cost UOM for costSheet on Change costingUOM DropDown
		onCostingUOMChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var skuTempObjectModel = this.skuTempObjectModel;
			var sourceInfoPath = this.sourceInfoPath;
			var clearConditionTypeDto = skuTempObjectModel.getProperty("/sourceInfoDtos/0/costSheetDto/conditionTypeDtos");
			var clearHeaderCostDto = skuTempObjectModel.getProperty("/sourceInfoDtos/0/costSheetDto/headerCostAndDiscountDtos");
			var clearLowerHeaderCostDto = skuTempObjectModel.getProperty("/sourceInfoDtos/0/costSheetDto/lowerHeaderCostAndDiscountDtos");
			var clearConditionTypeDtoData = jQuery.extend(true, [], clearConditionTypeDto);
			var clearHeaderCostDtoData = jQuery.extend(true, [], clearHeaderCostDto);
			var clearLowerHeaderCostDtoData = jQuery.extend(true, [], clearLowerHeaderCostDto);
			oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos = clearConditionTypeDtoData;
			oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.headerCostAndDiscountDtos = clearHeaderCostDtoData;
			oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.lowerHeaderCostAndDiscountDtos = clearLowerHeaderCostDtoData;
			oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.costOfDeliveryIncludedCostPerCase="";
			oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.costOfDeliveryIncludedCostPerEach="";
			var selectedCostingUOMKey = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.costUOM;
			var bracketPricingSwitchState = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.bracketPricingApplicable;
			var skuTempObjectModel = this.skuTempObjectModel;
			var costCase, grossPrice;
			costCase = "Cost/" + selectedCostingUOMKey;
			grossPrice = "Gross Price($/" + selectedCostingUOMKey + ")";
			if (selectedCostingUOMKey === "CS") {
				skuTempObjectModel.setProperty("/GrossPriceEAVisible", true);
				oDashboardVisibilityModel.setProperty("/costsheetToolBarBoxWidth", "24.8%");

			} else if (selectedCostingUOMKey === "EA") {
				skuTempObjectModel.setProperty("/GrossPriceEAVisible", false);
				oDashboardVisibilityModel.setProperty("/costsheetToolBarBoxWidth", "16.5%");

			}
			if (bracketPricingSwitchState === false) {
				oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos[0].costPerCaseEditable = "true";
			} else {
				oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.conditionTypeDtos[0].costPerCaseEditable = "false";
			}
			skuTempObjectModel.setProperty("/GROSS_PRICE", grossPrice);
			skuTempObjectModel.setProperty("/COST_CS", costCase);
			oDashboardTabModel.refresh();
			oDashboardVisibilityModel.refresh();
//			this.bottleDeposit();
		},
        
		//Function To Set Value CaseCountAvarage On change of bracket value in bracket Pricing Box
		onBracketChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var bracketDtos = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.bracketDtos;
			var currentBracket = oEvent.getSource().getValue();
			var sPath = oEvent.getSource().getCustomData()[0].getValue();
			var previousBracket;
//			if (sPath === "4") {
//				if (currentBracket === "") {
//					bracketDtos[4].uomCountMax = "";
//					bracketDtos[3].uomCountMax = "";
//					bracketDtos[2].uomCountMax = "";
//					bracketDtos[1].uomCountMax = "";
//					bracketDtos[0].uomCountMax = "";
//					bracketDtos[4].grossPricePerCase = "";
//					bracketDtos[3].grossPricePerCase = "";
//					bracketDtos[2].grossPricePerCase = "";
//					bracketDtos[1].grossPricePerCase = "";
//					bracketDtos[0].grossPricePerCase = "";
//					bracketDtos[4].grossPricePerEach = "";
//					bracketDtos[3].grossPricePerEach = "";
//					bracketDtos[2].grossPricePerEach = "";
//					bracketDtos[1].grossPricePerEach = "";
//					bracketDtos[0].grossPricePerEach = "";
//				}
//			}
			if (sPath === "4") {
				if (currentBracket === "") {
					bracketDtos[4].uomCountMax = "";
					bracketDtos[3].uomCountMax = "";
					bracketDtos[2].uomCountMax = "";
					bracketDtos[1].uomCountMax = "";
					bracketDtos[0].uomCountMax = "";
					bracketDtos[4].grossPricePerCase = "";
					bracketDtos[3].grossPricePerCase = "";
					bracketDtos[2].grossPricePerCase = "";
					bracketDtos[1].grossPricePerCase = "";
					bracketDtos[0].grossPricePerCase = "";
					bracketDtos[4].grossPricePerEach = "";
					bracketDtos[3].grossPricePerEach = "";
					bracketDtos[2].grossPricePerEach = "";
					bracketDtos[1].grossPricePerEach = "";
					bracketDtos[0].grossPricePerEach = "";
				}
			}
			if (sPath === "3") {
				if (currentBracket === "") {
					bracketDtos[3].uomCountMax = "";
					bracketDtos[2].uomCountMax = "";
					bracketDtos[1].uomCountMax = "";
					bracketDtos[0].uomCountMax = "";
					bracketDtos[3].grossPricePerCase = "";
					bracketDtos[2].grossPricePerCase = "";
					bracketDtos[1].grossPricePerCase = "";
					bracketDtos[0].grossPricePerCase = "";
					bracketDtos[3].grossPricePerEach = "";
					bracketDtos[2].grossPricePerEach = "";
					bracketDtos[1].grossPricePerEach = "";
					bracketDtos[0].grossPricePerEach = "";
				}
				previousBracket = bracketDtos[4].uomCountMax;
				if (parseFloat(previousBracket) > parseFloat(currentBracket)) {
					sap.m.MessageToast.show("Bracket4 value Should be greater than Bracket5 max");
					oEvent.getSource().setValue("");
				}
			}
			if (sPath === "2") {
				if (currentBracket === "") {
					bracketDtos[2].uomCountMax = "";
					bracketDtos[1].uomCountMax = "";
					bracketDtos[0].uomCountMax = "";
					bracketDtos[2].grossPricePerCase = "";
					bracketDtos[1].grossPricePerCase = "";
					bracketDtos[0].grossPricePerCase = "";
					bracketDtos[2].grossPricePerEach = "";
					bracketDtos[1].grossPricePerEach = "";
					bracketDtos[0].grossPricePerEach = "";
				}
				previousBracket = bracketDtos[3].uomCountMax;
				if (parseFloat(previousBracket) > parseFloat(currentBracket)) {
					sap.m.MessageToast.show("Bracket3 value Should be greater than Bracket4");
					oEvent.getSource().setValue("");
				}
			}
			if (sPath === "1") {
				if (currentBracket === "") {
					bracketDtos[1].uomCountMax = "";
					bracketDtos[0].uomCountMax = "";
					bracketDtos[1].grossPricePerCase = "";
					bracketDtos[0].grossPricePerCase = "";
					bracketDtos[1].grossPricePerEach = "";
					bracketDtos[0].grossPricePerEach = "";
				}
				previousBracket = bracketDtos[2].uomCountMax;
				if (parseFloat(previousBracket) > parseFloat(currentBracket)) {
					sap.m.MessageToast.show("Bracket2 value Should be greater than Bracket3");
					oEvent.getSource().setValue("");
				}
			}
			if (sPath === "0") {
				if (currentBracket === "") {
					bracketDtos[0].grossPricePerCase = "";
					bracketDtos[0].grossPricePerEach = "";
				}
				previousBracket = bracketDtos[1].uomCountMax;
				if (parseFloat(previousBracket) > parseFloat(currentBracket)) {
					sap.m.MessageToast.show("Bracket1 value Should be greater than Bracket2");
					oEvent.getSource().setValue("");
				}
			}
			oDashboardTabModel.refresh();
			this.onNegotiatedBracketSelection(oEvent);

		},
		
		//Function To Change Gross Price of Bracket Pricing
		onChangeBrtGrossPrice: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var bracketDtos = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.bracketDtos;
			var grosssPrice = (oEvent.getSource().getValue());
			var eachPerCase = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto.eachPerCase;
			var sPath = oEvent.getSource().getCustomData()[0].getValue();
			if (grosssPrice[0] === "$") {
				grosssPrice = grosssPrice.slice(1);
			}
			if (grosssPrice !== undefined && grosssPrice !== "") {
				bracketDtos[sPath].grossPricePerCase = parseFloat(grosssPrice);
				bracketDtos[sPath].grossPricePerEach = parseFloat(grosssPrice) / eachPerCase;
			}
			oDashboardTabModel.refresh();
			this.onBackhaulBracketSelection(oEvent);
			this.onNegotiatedBracketSelection(oEvent);
		},
		
		//Function To set Value on Selection of Backhaul Bracket
		onBackhaulBracketSelection: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var bracketDtos = costSheetDto.bracketDtos;
			var selectedBHBracket = parseInt(costSheetDto.backhaulBracket) - 1;
			var eachPerCase = costSheetDto.eachPerCase;
			var i;
			if (oEvent && bracketDtos[selectedBHBracket].grossPricePerCase !== undefined) {
				costSheetDto.sBHCase = bracketDtos[selectedBHBracket].grossPricePerCase;
				conditionTypeDtos[0].pickupCostPerCase = bracketDtos[selectedBHBracket].grossPricePerCase;
				conditionTypeDtos[0].pickupCostPerEach = bracketDtos[selectedBHBracket].grossPricePerCase / eachPerCase;
			}
			oDashboardTabModel.refresh();
			this.scrapAllowance();
			for (i = 0; i < 3; i++) {
				if (i === 0) {
					this.sPath = 2;
				} else if (i === 1) {
					this.sPath = 4;
				} else if (i === 2) {
					this.sPath = 7;
				}
				this.oncostPerCS();
			}
		},

		//Function To set Value on Selection of Backhaul Bracket
		onNegotiatedBracketSelection: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var bracketDtos = costSheetDto.bracketDtos;
			var nonProductCosts = costSheetDto.npcDtos;
			var selectedNGBracket = parseInt(costSheetDto.negotiatedBracket);
			var nonProductCostsLength = nonProductCosts.length - 1;
			var eachPerCase = costSheetDto.eachPerCase;

			var uomcount, scalingFactor, sPath;
			if (bracketDtos[selectedNGBracket].grossPricePerCase !== undefined && oEvent) {

				costSheetDto.sNGCase = bracketDtos[selectedNGBracket - 1].grossPricePerCase;
				conditionTypeDtos[0].deliveryCostPerCase = bracketDtos[selectedNGBracket - 1].grossPricePerCase;
				conditionTypeDtos[0].deliveryCostPerEach = bracketDtos[selectedNGBracket - 1].grossPricePerCase / eachPerCase;
			}
			if (selectedNGBracket === 5) {
				scalingFactor = bracketDtos[selectedNGBracket - 1].uomCountMin;
			} else if (selectedNGBracket === 4) {
				scalingFactor = parseInt(bracketDtos[selectedNGBracket].uomCountMax) + 1;
			} else {
				scalingFactor = parseInt(bracketDtos[selectedNGBracket].uomCountMax) + 1;
			}
			if (scalingFactor !== undefined && oEvent) {
				for (var i = 0; i < nonProductCostsLength; i++) {
					nonProductCosts[i].scalingFactor = scalingFactor;
					nonProductCosts[i].pickupCostPerCase = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
						nonProductCosts[i].scalingFactor))));
					nonProductCosts[i].pickupCostPerEach = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
						nonProductCosts[i].scalingFactor)) / eachPerCase));
					nonProductCosts[i].deliveryCostPerCase = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
						nonProductCosts[i].scalingFactor))));
					nonProductCosts[i].deliveryCostPerEach = parseFloat(((parseFloat(nonProductCosts[i].totalNonProductCosts)) / (parseFloat(
						nonProductCosts[i].scalingFactor)) / eachPerCase));
				}
				this.netInboundCosts();
			}

			oDashboardTabModel.refresh();

			this.scrapAllowance();
			for (i = 0; i < 3; i++) {
				if (i === 0) {
					this.sPath = 2;
				} else if (i === 1) {
					this.sPath = 4;
				} else if (i === 2) {
					this.sPath = 7;
				}
				this.oncostPerCS();
			}

		},
        
		//Function To Handle a value on Change of Cost Per Case
		onHandleCostPerCS: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var costPerCase, i;
			if (oEvent) {
				costPerCase = oEvent.getSource().getValue();
				var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
				var parts = path.split("/");
				var partsLen = parts.length;
				this.sPath = parseInt(parts.slice(partsLen - 1));
			}
			if (costPerCase[0] === "$") {
				costPerCase = costPerCase.slice(2);
			}
			if (costPerCase[0] === "(") {
				costPerCase = costPerCase.slice(1);
			}
			if (costPerCase[costPerCase.length - 1] === ")") {
				costPerCase = costPerCase.slice(0, costPerCase.length - 1);
			}
			conditionTypeDtos[this.sPath].costPerCase = costPerCase;
			if (this.sPath === 0) {
				for (i = 0; i < 4; i++) {
					if (i === 0) {
						this.sPath = 0;
						this.oncostPerCS(oEvent);
					} else if (i === 1) {
						this.sPath = 2;
						this.oncostPerCS();
					} else if (i === 2) {
						this.sPath = 4;
						this.oncostPerCS();
					} else if (i === 3) {
						this.sPath = 7;
						this.oncostPerCS();
					}

				}
			} else {
				this.oncostPerCS(oEvent);
			}
		},

		oncostPerCS: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var costPerCase, sPath;
			sPath = this.sPath;
			costPerCase = conditionTypeDtos[sPath].costPerCase;
			var sBHCase = parseFloat(costSheetDto.sBHCase);
			var sNGCase = parseFloat(costSheetDto.sNGCase);
			var eachPerCase = costSheetDto.eachPerCase;
			var pickupCostPerCase, deliveryCostPerCase;
			if (costPerCase !== undefined && costPerCase !== "") {
				if (costPerCase[0] === "-") {
					costPerCase = costPerCase.slice(1);
				}
				
				if(costPerCase[0]==="("){
					costPerCase = costPerCase.slice(1);
				}
				if(costPerCase[costPerCase.length-1]==="%"){
					costPerCase = costPerCase.slice(0,costPerCase.length-2);
				}
				if(costPerCase[costPerCase.length-1]===")"){
					costPerCase = costPerCase.slice(0,costPerCase.length-1);
				}
				if (conditionTypeDtos[sPath].costingValue === "-") {
					costPerCase = "-" + costPerCase;
				}
				if (sPath === 5) {
					conditionTypeDtos[sPath].costPerCase = costPerCase;
					this.scrapAllowance();
					return;
				}

				if (conditionTypeDtos[sPath].costingUnit === "%") {
					pickupCostPerCase = (costPerCase * sBHCase) / 100;
					deliveryCostPerCase = (costPerCase * sNGCase) / 100;
				} else {
					pickupCostPerCase = costPerCase;
					deliveryCostPerCase = costPerCase;
				}
				if (sPath === 6 || sPath === 7) {
					deliveryCostPerCase = "";
				}
				conditionTypeDtos[sPath].costPerCase = costPerCase;
				conditionTypeDtos[sPath].pickupCostPerCase = pickupCostPerCase;
				conditionTypeDtos[sPath].pickupCostPerEach = parseFloat(pickupCostPerCase) / eachPerCase;
				conditionTypeDtos[sPath].deliveryCostPerCase = deliveryCostPerCase;
				conditionTypeDtos[sPath].deliveryCostPerEach = parseFloat(deliveryCostPerCase) / eachPerCase;
			} else if (costPerCase === "") {
				conditionTypeDtos[sPath].costPerCase = "";
				conditionTypeDtos[sPath].pickupCostPerCase = "";
				conditionTypeDtos[sPath].pickupCostPerEach = "";
				conditionTypeDtos[sPath].deliveryCostPerCase = "";
				conditionTypeDtos[sPath].deliveryCostPerEach = "";
			}
			if (sPath === 0) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					costSheetDto.sBHCase = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGCase = parseFloat(conditionTypeDtos[sPath].deliveryCostPerCase);
				} else if (oEvent) {
					costSheetDto.sBHCase = 0;
					costSheetDto.sNGCase = 0;
				}

			}
			if (sPath === 1) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					conditionTypeDtos[2].costPerCaseEditable = false;
					costSheetDto.sBHOI = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGOI = parseFloat(conditionTypeDtos[sPath].deliveryCostPerCase);
				} else if (oEvent) {
					conditionTypeDtos[2].costPerCaseEditable = true;
					costSheetDto.sBHOI = 0;
					costSheetDto.sNGOI = 0;
				}

			}
			if (sPath === 2) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					conditionTypeDtos[1].costPerCaseEditable = false;
					costSheetDto.sBHOI = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGOI = parseFloat(conditionTypeDtos[sPath].deliveryCostPerCase);
				} else if (oEvent) {
					conditionTypeDtos[1].costPerCaseEditable = true;
					costSheetDto.sBHOI = 0;
					costSheetDto.sNGOI = 0;
				}

			}
			if (sPath === 3) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					conditionTypeDtos[4].costPerCaseEditable = false;
					costSheetDto.sBHTempOI = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGTempOI = parseFloat(conditionTypeDtos[sPath].deliveryCostPerCase);
				} else if (oEvent) {
					conditionTypeDtos[4].costPerCaseEditable = true;
					costSheetDto.sBHTempOI = 0;
					costSheetDto.sNGTempOI = 0;
				}

			}
			if (sPath === 4) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					conditionTypeDtos[3].costPerCaseEditable = false;
					costSheetDto.sBHTempOI = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGTempOI = parseFloat(conditionTypeDtos[sPath].deliveryCostPerCase);
				} else if (oEvent) {
					conditionTypeDtos[3].costPerCaseEditable = true;
					costSheetDto.sBHTempOI = 0;
					costSheetDto.sNGTempOI = 0;
				}

			}
			if (sPath === 6) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					conditionTypeDtos[7].costPerCaseEditable = false;
					conditionTypeDtos[sPath].deliveryCostPerEach = "";
					costSheetDto.sBHBH = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGBH = 0;
				} else if (oEvent) {
					conditionTypeDtos[7].costPerCaseEditable = true;
					conditionTypeDtos[sPath].deliveryCostPerEach = "";
					costSheetDto.sBHBH = 0;
					costSheetDto.sNGBH = 0;
				}

				costSheetDto.sNGBH = 0;
			}
			if (sPath === 7) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					conditionTypeDtos[6].costPerCaseEditable = false;
					conditionTypeDtos[sPath].deliveryCostPerEach = "";
					costSheetDto.sBHBH = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGBH = 0;
				} else if (oEvent) {
					conditionTypeDtos[6].costPerCaseEditable = true;
					conditionTypeDtos[sPath].deliveryCostPerEach = "";
					costSheetDto.sBHBH = 0;
					costSheetDto.sNGBH = 0;
				}

			}
			if (sPath === 9) {
				if (conditionTypeDtos[sPath].costPerCase !== "") {
					costSheetDto.sBHMiscCost = parseFloat(conditionTypeDtos[sPath].pickupCostPerCase);
					costSheetDto.sNGMiscCost = parseFloat(conditionTypeDtos[sPath].deliveryCostPerCase);
				} else if (oEvent) {
					costSheetDto.sBHMiscCost = 0;
					costSheetDto.sNGMiscCost = 0;
				}
			}

			oDashboardTabModel.refresh();
			this.scrapAllowance();
			this.netheaderCost();

		},
		
		//Function To Set value for calculation on change of scrapAllowance
		scrapAllowance: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var costPerCase = conditionTypeDtos[5].costPerCase;
			var eachPerCase = costSheetDto.eachPerCase;
			var scrapAllowanceSelectedIndex;
			if (oEvent) {
				scrapAllowanceSelectedIndex = oEvent.getSource().getSelectedIndex();
				costSheetDto.scrapAllowanceApplicableOn = scrapAllowanceSelectedIndex;
			} else {
				scrapAllowanceSelectedIndex = parseInt(costSheetDto.scrapAllowanceApplicableOn);
			}
			var sBHCase = parseFloat(costSheetDto.sBHCase);
			var sNGCase = parseFloat(costSheetDto.sNGCase);
			var sNGTempOI = parseFloat(costSheetDto.sNGTempOI);
			var sBHTempOI = parseFloat(costSheetDto.sBHTempOI);
			var sBHOI = parseFloat(costSheetDto.sBHOI);
			var sNGOI = parseFloat(costSheetDto.sNGOI);
			var sBHScrap = 0,
				sNGScrap = 0;
			if (costPerCase !== "") {

				if (scrapAllowanceSelectedIndex === 0) {
					sBHScrap = (costPerCase * sBHCase) / 100;
					sNGScrap = (costPerCase * sNGCase) / 100;
				} else if (scrapAllowanceSelectedIndex === 1) {
					sBHScrap = (parseFloat(costPerCase) * (sBHCase + sBHOI + sBHTempOI)) / 100;
					sNGScrap = (parseFloat(costPerCase) * (sNGCase + sNGOI + sNGTempOI)) / 100;
				}
				costSheetDto.sBHScrap = sBHScrap;
				costSheetDto.sNGScrap = sNGScrap;

				conditionTypeDtos[5].pickupCostPerCase = sBHScrap;
				conditionTypeDtos[5].pickupCostPerEach = parseFloat(sBHScrap) / eachPerCase;
				conditionTypeDtos[5].deliveryCostPerCase = sNGScrap;
				conditionTypeDtos[5].deliveryCostPerEach = parseFloat(sNGScrap) / eachPerCase;
				oDashboardTabModel.refresh();
				this.netheaderCost();

			}
		},
		
		netheaderCost: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var sBHCase = parseFloat(costSheetDto.sBHCase);
			var sNGCase = parseFloat(costSheetDto.sNGCase);
			var sNGTempOI = parseFloat(costSheetDto.sNGTempOI);
			var sBHTempOI = parseFloat(costSheetDto.sBHTempOI);
			var sBHOI = parseFloat(costSheetDto.sBHOI);
			var sNGOI = parseFloat(costSheetDto.sNGOI);
			var preBHNetheaderCost, preNGNetheaderCost, preBHNetheaderCostEach, preNGNetheaderCostEach, i;
			var sBHScrap = parseFloat(costSheetDto.sBHScrap);
			var sNGScrap = parseFloat(costSheetDto.sNGScrap);
			var sBHMiscCost = parseFloat(costSheetDto.sBHMiscCost);
			var sNGMiscCost = parseFloat(costSheetDto.sNGMiscCost);
			var sBHBH = parseFloat(costSheetDto.sBHBH);
			var eachPerCase = costSheetDto.eachPerCase;

			preBHNetheaderCost = sBHCase + sBHOI + sBHTempOI + sBHBH + sBHScrap + sBHMiscCost;
			preNGNetheaderCost = sNGCase + sNGOI + sNGTempOI + sNGScrap + sNGMiscCost;
			preBHNetheaderCostEach = preBHNetheaderCost / eachPerCase;
			preNGNetheaderCostEach = preNGNetheaderCost / eachPerCase;
			conditionTypeDtos[10].pickupCostPerCase = (preBHNetheaderCost);
			conditionTypeDtos[10].pickupCostPerEach = (preBHNetheaderCostEach);
			conditionTypeDtos[10].deliveryCostPerCase = (preNGNetheaderCost);
			conditionTypeDtos[10].deliveryCostPerEach = (preNGNetheaderCostEach);
			oDashboardTabModel.refresh();
			for (i = 0; i < 3; i++) {
				this.headerCostSpath = i;
				this.onheaderCostChange();
			}
		},
		
		
		onheaderCostChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var headerCostAndDiscountDtos = costSheetDto.headerCostAndDiscountDtos;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var eachPerCase = costSheetDto.eachPerCase;
			var bracketPricingDatapickUpCase = parseFloat(conditionTypeDtos[10].pickupCostPerCase);
			var bracketPricingDatadeliveredCase = parseFloat(conditionTypeDtos[10].deliveryCostPerCase);
			var bracketPricingDatapickUpEach = parseFloat(conditionTypeDtos[10].pickupCostPerEach);
			var bracketPricingDatadeliveredEach = parseFloat(conditionTypeDtos[10].deliveryCostPerEach);
			var sPath, HCTypeKey, costCategory;
			if (oEvent) {
				var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
				var parts = path.split("/");
				var partsLen = parts.length;
				sPath = parseInt(parts.slice(partsLen - 1));
				HCTypeKey = headerCostAndDiscountDtos[sPath].type;
				var sourceType = oEvent.getSource().getMetadata().getName();
				costCategory = headerCostAndDiscountDtos[sPath].costCategory;
				var headerCost;
				if (sourceType !== "sap.m.Select") {
					headerCost = oEvent.getSource().getValue();
					// headerCostAndDiscountDtos[sPath].costPercentage = headerCost;
				} else {
					headerCost = headerCostAndDiscountDtos[sPath].costPercentage;
				}
			} else {
				sPath = this.headerCostSpath;
				headerCost = headerCostAndDiscountDtos[sPath].costPercentage;
				HCTypeKey = headerCostAndDiscountDtos[sPath].type;
				costCategory = headerCostAndDiscountDtos[sPath].costCategory;
			}
			if (costCategory !== "" && costCategory !== undefined && HCTypeKey !== "" && HCTypeKey !== undefined) {
				headerCostAndDiscountDtos[sPath].costPercentageEditable = "true";
				if (headerCost[0] === "(") {
					headerCost = headerCost.slice(1);
				}

				if (headerCost[headerCost.length - 1] === "%") {
					headerCost = headerCost.slice(0, headerCost.length - 2);
				}
				if (headerCost[headerCost.length - 1] === ")") {
					headerCost = headerCost.slice(0, headerCost.length - 1);
				}

				if (HCTypeKey !== undefined && HCTypeKey !== "" && headerCost !== undefined && headerCost !== "") {
					headerCost = headerCost.toString();
					if (HCTypeKey === "2" && headerCost[0] !== "-") {
						headerCost = "-" + headerCost;
					}
					if (HCTypeKey === "1" && headerCost[0] === "-") {
						headerCost = headerCost.slice(1);
					}
					headerCostAndDiscountDtos[sPath].costPercentage = parseFloat(headerCost);
					headerCostAndDiscountDtos[sPath].pickupCostPerCase = (((headerCost / 100) * bracketPricingDatapickUpCase));
					headerCostAndDiscountDtos[sPath].deliveryCostPerCase = (((headerCost / 100) * bracketPricingDatadeliveredCase));
					headerCostAndDiscountDtos[sPath].pickupCostPerEach = (((headerCost / (eachPerCase * 100)) * bracketPricingDatapickUpCase));
					headerCostAndDiscountDtos[sPath].deliveryCostPerEach = (((headerCost / (eachPerCase * 100)) * bracketPricingDatadeliveredCase));
					oDashboardTabModel.refresh();

				} else if (headerCost === "") {
					headerCostAndDiscountDtos[sPath].costPercentage = headerCost;
					headerCostAndDiscountDtos[sPath].pickupCostPerCase = headerCost;
					headerCostAndDiscountDtos[sPath].deliveryCostPerCase = headerCost;
					headerCostAndDiscountDtos[sPath].pickupCostPerEach = headerCost;
					headerCostAndDiscountDtos[sPath].deliveryCostPerEach = headerCost;
				}

			} else {
				headerCostAndDiscountDtos[sPath].costPercentageEditable = "false";
				headerCostAndDiscountDtos[sPath].costPercentage = "";
				headerCostAndDiscountDtos[sPath].pickupCostPerCase = "";
				headerCostAndDiscountDtos[sPath].deliveryCostPerCase = "";
				headerCostAndDiscountDtos[sPath].pickupCostPerEach = "";
				headerCostAndDiscountDtos[sPath].deliveryCostPerEach = "";

			}
			oDashboardTabModel.refresh();
			this.netHeaderCost1();
		},
		
		netHeaderCost1: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var headerCostAndDiscountDtos = costSheetDto.headerCostAndDiscountDtos;
			var lowerHeaderCostAndDiscountDtos = costSheetDto.lowerHeaderCostAndDiscountDtos;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var sHCLength = headerCostAndDiscountDtos.length;
			var eachPerCase = costSheetDto.eachPerCase;
			var i, netHeaderPickupCost = 0,
				netHeaderDeliveredCost = 0;
			for (i = 0; i < sHCLength; i++) {
				if (headerCostAndDiscountDtos[i].pickupCostPerCase !== "") {
					netHeaderPickupCost = netHeaderPickupCost + (parseFloat(headerCostAndDiscountDtos[i].pickupCostPerCase));
				}
				if (headerCostAndDiscountDtos[i].deliveryCostPerCase !== "") {
					netHeaderDeliveredCost = netHeaderDeliveredCost + (parseFloat(headerCostAndDiscountDtos[i].deliveryCostPerCase));
				}
			}
			lowerHeaderCostAndDiscountDtos[0].pickupCostPerCase = netHeaderPickupCost;
			lowerHeaderCostAndDiscountDtos[0].pickupCostPerEach = netHeaderPickupCost / eachPerCase;
			lowerHeaderCostAndDiscountDtos[0].deliveryCostPerCase = netHeaderDeliveredCost;
			lowerHeaderCostAndDiscountDtos[0].deliveryCostPerEach = netHeaderDeliveredCost / eachPerCase;

			lowerHeaderCostAndDiscountDtos[1].pickupCostPerCase = parseFloat(conditionTypeDtos[10].pickupCostPerCase) + netHeaderPickupCost;
			lowerHeaderCostAndDiscountDtos[1].pickupCostPerEach = parseFloat(conditionTypeDtos[10].pickupCostPerEach) + netHeaderPickupCost /
				eachPerCase;
			lowerHeaderCostAndDiscountDtos[1].deliveryCostPerCase = parseFloat(conditionTypeDtos[10].deliveryCostPerCase) +
				netHeaderDeliveredCost;
			lowerHeaderCostAndDiscountDtos[1].deliveryCostPerEach = parseFloat(conditionTypeDtos[10].deliveryCostPerEach) +
				netHeaderDeliveredCost / eachPerCase;
			oDashboardTabModel.refresh();
			for (i = 0; i < 3; i++) {
				if (i === 0) {
					this.discountChangeSpath = 2;
				} else if (i === 1) {
					this.discountChangeSpath = 3;
				} else if (i === 2) {
					this.discountChangeSpath = 5;
				}
				this.onDiscountChange();
			}
		},
		
		onDiscountChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var headerCostAndDiscountDtos = costSheetDto.headerCostAndDiscountDtos;
			var lowerHeaderCostAndDiscountDtos = costSheetDto.lowerHeaderCostAndDiscountDtos;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var pickupGross = conditionTypeDtos[0].pickupCostPerCase;
			var deliverGross = conditionTypeDtos[0].deliveryCostPerCase;
			var eachPerCase = costSheetDto.eachPerCase;
			var sPath, discount;
			if (oEvent) {
				discount = oEvent.getSource().getValue();
				var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
				var parts = path.split("/");
				var partsLen = parts.length;
				sPath = parseInt(parts.slice(partsLen - 1));
			} else {
				sPath = this.discountChangeSpath;
				discount = lowerHeaderCostAndDiscountDtos[sPath].costPercentage;
			}
			if (discount[0] === "$") {
				discount = discount.slice(2);
			}
			if (discount[0] === "(" || discount[0] === "$") {
				discount = discount.slice(1);
			}
			if (discount[discount.length - 1] === "%") {
				discount = discount.slice(0, discount.length - 2);
			}
			if (discount[discount.length - 1] === ")") {
				discount = discount.slice(0, discount.length - 1);
			}
			if (discount !== "" && discount[0] !== "-") {
				discount = "-" + discount;
			}
			if (sPath === 3) {
				lowerHeaderCostAndDiscountDtos[sPath].costPercentage = discount;
				if (discount !== "") {
					lowerHeaderCostAndDiscountDtos[2].costPercentageEditable = false;
				} else {
					lowerHeaderCostAndDiscountDtos[2].costPercentageEditable = true;
				}
				costSheetDto.accrualSpath = 3;
				oDashboardTabModel.refresh();
				this.netHeaderCost2();
				return;
			}

			if (sPath === 2) {
				costSheetDto.accrualSpath = 2;
				if (discount !== "") {
					lowerHeaderCostAndDiscountDtos[3].costPercentageEditable = false;
				} else {
					lowerHeaderCostAndDiscountDtos[3].costPercentageEditable = true;
				}
				lowerHeaderCostAndDiscountDtos[sPath].costPercentage = discount;
				lowerHeaderCostAndDiscountDtos[sPath].pickupCostPerCase = discount;
				lowerHeaderCostAndDiscountDtos[sPath].pickupCostPerEach = parseFloat(discount) / eachPerCase;
				lowerHeaderCostAndDiscountDtos[sPath].deliveryCostPerCase = discount;
				lowerHeaderCostAndDiscountDtos[sPath].deliveryCostPerEach = parseFloat(discount) / eachPerCase;
				oDashboardTabModel.refresh();
				this.netHeaderCost2();
			}
			
			if (sPath === 5) {
				if (discount !== "") {
					lowerHeaderCostAndDiscountDtos[3].costPercentageEditable = false;
				} else {
					lowerHeaderCostAndDiscountDtos[3].costPercentageEditable = true;
				}
				lowerHeaderCostAndDiscountDtos[sPath].costPercentage = discount;
				lowerHeaderCostAndDiscountDtos[sPath].pickupCostPerCase = discount * pickupGross / 100;
				lowerHeaderCostAndDiscountDtos[sPath].pickupCostPerEach = parseFloat(discount * pickupGross) / (eachPerCase * 100);
				lowerHeaderCostAndDiscountDtos[sPath].deliveryCostPerCase = discount * deliverGross / 100;
				lowerHeaderCostAndDiscountDtos[sPath].deliveryCostPerEach = parseFloat(discount * deliverGross) / (eachPerCase * 100);
				oDashboardTabModel.refresh();
				this.netHeaderCost3(oEvent);
			}

		},
		
		netHeaderCost2: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var lowerHeaderCostAndDiscountDtos = costSheetDto.lowerHeaderCostAndDiscountDtos;
			var sBHCase = parseFloat(costSheetDto.sBHCase);
			var sNGCase = parseFloat(costSheetDto.sNGCase);
			var sNGTempOI = parseFloat(costSheetDto.sNGTempOI);
			var sBHTempOI = parseFloat(costSheetDto.sBHTempOI);
			var sBHOI = parseFloat(costSheetDto.sBHOI);
			var sNGOI = parseFloat(costSheetDto.sNGOI);
			var preBHNetheaderCost, preNGNetheaderCost, preBHNetheaderCostEach, preNGNetheaderCostEach;
			var sBHScrap = parseFloat(costSheetDto.sBHScrap);
			var sNGScrap = parseFloat(costSheetDto.sNGScrap);
			var sBHMiscCost = parseFloat(costSheetDto.sBHMiscCost);
			var sNGMiscCost = parseFloat(costSheetDto.sNGMiscCost);
			var sBHBH = parseFloat(costSheetDto.sBHBH);
			var sPath = parseInt(costSheetDto.accrualSpath);
			var eachPerCase = costSheetDto.eachPerCase;
			var discount = lowerHeaderCostAndDiscountDtos[sPath].costPercentage;
			var billbackSelectedIndex;
			if (oEvent) {
				billbackSelectedIndex = oEvent.getSource().getSelectedIndex();
				costSheetDto.billbackOnAccuralApplicableOn = billbackSelectedIndex;
			} else {
				billbackSelectedIndex = parseInt(costSheetDto.billbackOnAccuralApplicableOn);
			}

			var netPostHeaderAccrualPickUpCase = 0,
				netPostHeaderAccrualDeliveredCase = 0,
				netPostHeaderAccrualPickUpEach = 0,
				netPostHeaderAccrualDeliveredEach = 0;

			var netPostHeaderPickUpCase = parseFloat(lowerHeaderCostAndDiscountDtos[1].pickupCostPerCase);
			var netPostHeaderDeliveredCase = parseFloat(lowerHeaderCostAndDiscountDtos[1].deliveryCostPerCase);
			var netPostHeaderPickUpEach = parseFloat(lowerHeaderCostAndDiscountDtos[1].pickupCostPerEach);
			var netPostHeaderDeliveredEach = parseFloat(lowerHeaderCostAndDiscountDtos[1].deliveryCostPerEach);

			preBHNetheaderCost = sBHCase + sBHOI + sBHTempOI + sBHBH + sBHScrap + sBHMiscCost;
			preNGNetheaderCost = sNGCase + sNGOI + sNGTempOI + sNGScrap + sNGMiscCost;
			// preBHNetheaderCostEach = preBHNetheaderCost / eachPerCase;
			// preNGNetheaderCostEach = preNGNetheaderCost / eachPerCase;

			if (sPath === 3 && discount !== "") {
				if (billbackSelectedIndex === 1) {
					netPostHeaderAccrualPickUpCase = preBHNetheaderCost * discount / 100;
					netPostHeaderAccrualDeliveredCase = preNGNetheaderCost * discount / 100;
					netPostHeaderAccrualPickUpEach = netPostHeaderAccrualPickUpCase / eachPerCase;
					netPostHeaderAccrualDeliveredEach = netPostHeaderAccrualDeliveredCase / eachPerCase;
				} else if (billbackSelectedIndex === 0) {
					netPostHeaderAccrualPickUpCase = (sBHCase) * discount / 100;
					netPostHeaderAccrualDeliveredCase = (sNGCase) * discount / 100;
					netPostHeaderAccrualPickUpEach = netPostHeaderAccrualPickUpCase / eachPerCase;
					netPostHeaderAccrualDeliveredEach = netPostHeaderAccrualDeliveredCase / eachPerCase;
				}
				lowerHeaderCostAndDiscountDtos[3].pickupCostPerCase = netPostHeaderAccrualPickUpCase;
				lowerHeaderCostAndDiscountDtos[3].pickupCostPerEach = netPostHeaderAccrualPickUpEach;
				lowerHeaderCostAndDiscountDtos[3].deliveryCostPerCase = netPostHeaderAccrualDeliveredCase;
				lowerHeaderCostAndDiscountDtos[3].deliveryCostPerEach = netPostHeaderAccrualDeliveredEach;
			} else if (sPath === 3 && discount === "") {
				lowerHeaderCostAndDiscountDtos[3].pickupCostPerCase = "";
				lowerHeaderCostAndDiscountDtos[3].pickupCostPerEach = "";
				lowerHeaderCostAndDiscountDtos[3].deliveryCostPerCase = "";
				lowerHeaderCostAndDiscountDtos[3].deliveryCostPerEach = "";
			}

			if (sPath === 2 && discount !== "") {

				// if (billbackSelectedIndex === 1) {
				// 	netPostHeaderAccrualPickUpCase = preBHNetheaderCost + parseFloat(lowerHeaderCostAndDiscountDtos[2].pickupCostPerCase);
				// 	netPostHeaderAccrualDeliveredCase = preNGNetheaderCost + parseFloat(lowerHeaderCostAndDiscountDtos[2].deliveryCostPerCase);
				// 	netPostHeaderAccrualPickUpEach = parseFloat(lowerHeaderCostAndDiscountDtos[2].pickupCostPerEach);
				// 	netPostHeaderAccrualDeliveredEach = parseFloat(lowerHeaderCostAndDiscountDtos[2].deliveryCostPerEach);
				// } else if (billbackSelectedIndex === 0) {
				netPostHeaderAccrualPickUpCase = parseFloat(lowerHeaderCostAndDiscountDtos[2].pickupCostPerCase);
				netPostHeaderAccrualDeliveredCase = parseFloat(lowerHeaderCostAndDiscountDtos[2].deliveryCostPerCase);
				netPostHeaderAccrualPickUpEach = parseFloat(lowerHeaderCostAndDiscountDtos[2].pickupCostPerEach);
				netPostHeaderAccrualDeliveredEach = parseFloat(lowerHeaderCostAndDiscountDtos[2].deliveryCostPerEach);

				// }

			}
			lowerHeaderCostAndDiscountDtos[4].pickupCostPerCase = (netPostHeaderAccrualPickUpCase + netPostHeaderPickUpCase);
			lowerHeaderCostAndDiscountDtos[4].pickupCostPerEach = (netPostHeaderAccrualPickUpEach + netPostHeaderPickUpEach);
			lowerHeaderCostAndDiscountDtos[4].deliveryCostPerCase = (netPostHeaderAccrualDeliveredCase + netPostHeaderDeliveredCase);
			lowerHeaderCostAndDiscountDtos[4].deliveryCostPerEach = (netPostHeaderAccrualDeliveredEach + netPostHeaderDeliveredEach);
			oDashboardTabModel.refresh();
			this.netHeaderCost3();
		},
		
		netHeaderCost3: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var lowerHeaderCostAndDiscountDtos = costSheetDto.lowerHeaderCostAndDiscountDtos;
			var discount = lowerHeaderCostAndDiscountDtos[5].costPercentage;
			var headerPickUpCase = 0,
				headerPickUpEach = 0,
				headerDeliveredCase = 0,
				headerDeliveredEach = 0;

			if (discount !== "") {
				headerPickUpCase = parseFloat(lowerHeaderCostAndDiscountDtos[5].pickupCostPerCase);
				headerPickUpEach = parseFloat(lowerHeaderCostAndDiscountDtos[5].pickupCostPerEach);
				headerDeliveredCase = parseFloat(lowerHeaderCostAndDiscountDtos[5].deliveryCostPerCase);
				headerDeliveredEach = parseFloat(lowerHeaderCostAndDiscountDtos[5].deliveryCostPerEach);
			}

			var netHeaderPickUpCase = parseFloat(lowerHeaderCostAndDiscountDtos[4].pickupCostPerCase);
			var netHeaderPickUpEach = parseFloat(lowerHeaderCostAndDiscountDtos[4].pickupCostPerEach);
			var netHeaderDeliveredCase = parseFloat(lowerHeaderCostAndDiscountDtos[4].deliveryCostPerCase);
			var netHeaderDeliveredEach = parseFloat(lowerHeaderCostAndDiscountDtos[4].deliveryCostPerEach);

			lowerHeaderCostAndDiscountDtos[6].pickupCostPerCase = ((headerPickUpCase + netHeaderPickUpCase));
			lowerHeaderCostAndDiscountDtos[6].pickupCostPerEach = ((headerPickUpEach + netHeaderPickUpEach));
			lowerHeaderCostAndDiscountDtos[6].deliveryCostPerCase = ((headerDeliveredCase + netHeaderDeliveredCase));
			lowerHeaderCostAndDiscountDtos[6].deliveryCostPerEach = ((headerDeliveredEach + netHeaderDeliveredEach));
			oDashboardTabModel.refresh();
			this.costOfDelivery();
		},

		costOfDelivery: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var lowerHeaderCostAndDiscountDtos = costSheetDto.lowerHeaderCostAndDiscountDtos;
			costSheetDto.costOfDeliveryIncludedCostPerCase = lowerHeaderCostAndDiscountDtos[6].deliveryCostPerCase -
				lowerHeaderCostAndDiscountDtos[6].pickupCostPerCase;
			costSheetDto.costOfDeliveryIncludedCostPerEach = lowerHeaderCostAndDiscountDtos[6].deliveryCostPerEach -
				lowerHeaderCostAndDiscountDtos[6].pickupCostPerEach;
		},

		onTotalNPCChange: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var nonProductCosts = costSheetDto.npcDtos;
			var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
			var parts = path.split("/");
			var partsLen = parts.length;
			var sPath = parseInt(parts.slice(partsLen - 1));
			var totalNPC = oEvent.getSource().getValue();
			if (totalNPC[0] === "$") {
				totalNPC = totalNPC.slice(1);
			}
			nonProductCosts[sPath].totalNonProductCosts = totalNPC;
			var eachPerCase = costSheetDto.eachPerCase;

			if (nonProductCosts[sPath].scalingFactor !== undefined && nonProductCosts[sPath].scalingFactor !== "") {
				var pickupPerCase = parseFloat(totalNPC) / nonProductCosts[sPath].scalingFactor;
				nonProductCosts[sPath].pickupCostPerCase = pickupPerCase;
				nonProductCosts[sPath].pickupCostPerEach = pickupPerCase / eachPerCase;
				nonProductCosts[sPath].deliveryCostPerCase = pickupPerCase;
				nonProductCosts[sPath].deliveryCostPerEach = pickupPerCase / eachPerCase;
			}
			oDashboardTabModel.refresh();
			this.netInboundCosts();
		},
		
		netInboundCosts: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var sourceInfoPath = this.sourceInfoPath;
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var nonProductCosts = costSheetDto.npcDtos;
			var nonProductCostsLength = nonProductCosts.length - 1;
			var eachPerCase = costSheetDto.eachPerCase;
			var i, totalNPC = 0,
				pickupCost = 0,
				deliveredCost = 0;
			for (i = 0; i < nonProductCostsLength; i++) {
				if (nonProductCosts[i].totalNonProductCosts !== "" && nonProductCosts[i].totalNonProductCosts !== undefined) {
					totalNPC = totalNPC + parseFloat(nonProductCosts[i].totalNonProductCosts);
				}
				if (nonProductCosts[i].pickupCostPerCase !== "" && nonProductCosts[i].pickupCostPerCase !== undefined) {
					pickupCost = pickupCost + parseFloat(nonProductCosts[i].pickupCostPerCase);
					nonProductCosts[nonProductCostsLength].pickupCostPerCase = pickupCost;
					nonProductCosts[nonProductCostsLength].pickupCostPerEach = pickupCost / eachPerCase;
				}
				if (nonProductCosts[i].deliveryCostPerCase !== "" && nonProductCosts[i].deliveryCostPerCase !== undefined) {
					deliveredCost = deliveredCost + parseFloat(nonProductCosts[i].deliveryCostPerCase);
					nonProductCosts[nonProductCostsLength].deliveryCostPerCase = deliveredCost;
					nonProductCosts[nonProductCostsLength].deliveryCostPerEach = deliveredCost / eachPerCase;
				}
			}
			nonProductCosts[nonProductCostsLength].totalNonProductCosts = totalNPC;
			oDashboardTabModel.refresh();
		},
		
		//Function for onChange FromDate In CostSheet
		onFromDateChange: function(oEvent) {
			var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
			var parts = path.split("/");
			var partsLen = parts.length;
			var sPath = parseInt(parts.slice(partsLen - 1));
			var sourceInfoPath = this.sourceInfoPath;
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var fromDate = conditionTypeDtos[sPath].validFrom;
			fromDate = new Date(fromDate);
			var toDate = conditionTypeDtos[sPath].validTo;
			toDate = new Date(toDate);
			var todayDate = new Date();
			var isDateAreEqual = formatter.checkTwoDatesIsEqual(todayDate, fromDate);
			if(isDateAreEqual){
				oEvent.getSource().setValueState("None");
			}else if (fromDate < todayDate) {
				sap.m.MessageToast.show("From Date cannot be less than Today's Date");
				oEvent.getSource().setValueState("Error");
			}else{
				oEvent.getSource().setValueState("None");
			}
			if (fromDate !== undefined && fromDate !== "" && toDate !== undefined && toDate !== "") {
				if (fromDate > toDate) {
					sap.m.MessageToast.show("To Date cannot be less than From Date");
					oEvent.getSource().setValueState("Error");
				}else{
					oEvent.getSource().setValueState("None");
				}
			}
		},
		
		//Function For onChange Of ToDate In costSheet
		onToDateChange: function(oEvent) {
			var path = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
			var parts = path.split("/");
			var partsLen = parts.length;
			var sPath = parseInt(parts.slice(partsLen - 1));
			var sourceInfoPath = this.sourceInfoPath;
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardTabModelData = oDashboardTabModel.getProperty("/");
			var costSheetDto = oDashboardTabModelData.sourceInfoDtos[sourceInfoPath].costSheetDto;
			var conditionTypeDtos = costSheetDto.conditionTypeDtos;
			var fromDate = conditionTypeDtos[sPath].validFrom;
			fromDate = new Date(fromDate);
			var toDate = conditionTypeDtos[sPath].validTo;
			toDate = new Date(toDate);
			var todayDate = new Date();
			var isDateAreEqual = formatter.checkTwoDatesIsEqual(todayDate, fromDate);
			if(isDateAreEqual){
				oEvent.getSource().setValueState("None");
			}else if (fromDate < todayDate) {
				sap.m.MessageToast.show("From Date cannot be less than Today's Date");
				oEvent.getSource().setValueState("Error");
			} else{
				oEvent.getSource().setValueState("None");
			}
			if (fromDate !== undefined && fromDate !== "" && toDate !== undefined && toDate !== "") {
				if (fromDate > toDate) {
					sap.m.MessageToast.show("To Date cannot be less than From Date");
					oEvent.getSource().setValueState("Error");
				}else{
					oEvent.getSource().setValueState("None");
				}
			}
		},
		
		//Function To Set Value of GTIN_CS and GTIN_EA on Selection of Hierarchy
		onChangeCSHierarchy: function(oEvent){
			var selKey = oEvent.getSource().getSelectedKey();
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var wgtDimData = oDashboardTabModel.getProperty("/weightsAndDimsDtos");
			for(var i = 0; i<wgtDimData.length; i++){
				if(wgtDimData[i].hierarchy === selKey){
					var gtinEaVal = wgtDimData[i].gtinEA;
					var gtinCsVal = wgtDimData[i].gtinCS;
					oDashboardVisibilityModel.setProperty("/costSheetGtinEaValue", gtinEaVal);
					oDashboardVisibilityModel.setProperty("/costSheetGtinCsValue", gtinCsVal);
					oDashboardVisibilityModel.refresh();
					return;
				}
			}
		},
		//Function to open add notes fragment
		openAddNotesFrag:function(oEvent){
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var sPath = oEvent.getSource().getBindingContext("oDashboardTabModel").getPath();
			var notes = oDashboardTabModel.getProperty(sPath+"/notes");
			if(notes!==undefined){
				skuTempObjectModel.setProperty("/notes",notes);
			}
			skuTempObjectModel.setProperty("/notesBindingPath",sPath);
			if (!this.addNotesPopover) {
				this.addNotesPopover = sap.ui.xmlfragment("freshdirect.SKU.fragments.addNotes", this);
				this.getView().addDependent(this.addNotesPopover);
			}
			this.addNotesPopover.openBy(oEvent.getSource());
		},

		//Function triggered when addNotes is clicked
		onAddNotes:function(){
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var notes = skuTempObjectModel.getProperty("/notes");
			var sPath = skuTempObjectModel.getProperty("/notesBindingPath");
			oDashboardTabModel.setProperty(sPath+"/notes",notes);
			oDashboardTabModel.refresh();
			this.addNotesPopover.close();
		},
		
		onCancelNotes: function(){
			this.addNotesPopover.close();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<COSTSHEET_PANEL_END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<PRODUCT_SOURCE_TAB_END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CFM_TAB-START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//Function To Set Value in CFM tab on Load time
		setCFMTabValue: function(){
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			//this.setTempDataForCFM();//Temp Function for Data Set when data will come proper need to remove this
			var sourceInfoDtosData = oDashboardTabModel.getProperty("/sourceInfoDtos");
			//Set Tier Value
			var tier1Val = oDashboardTabModel.getProperty("/ideationDto/tier1");
			var tier2Val = oDashboardTabModel.getProperty("/ideationDto/tier2");
			var tier3Val = oDashboardTabModel.getProperty("/ideationDto/tier3");
			var tier4Val = oDashboardTabModel.getProperty("/ideationDto/tier4");
			oDashboardTabModel.setProperty("/commercialFinanceDto/idtnTier1Val",tier1Val);
			oDashboardTabModel.setProperty("/commercialFinanceDto/idtnTier2Val",tier2Val);
			oDashboardTabModel.setProperty("/commercialFinanceDto/idtnTier3Val",tier3Val);
			oDashboardTabModel.setProperty("/commercialFinanceDto/idtnTier4Val",tier4Val);
			
			//oDashboardTabModel.setProperty("/commercialFinanceDto/approved", true);
			
			this.getTierGrossMarginPer();//Function call For getting Gross Margin Percent
			
			//Set VendorValue
			var primaryVenIndex = 0;
			var secondaryVenIndex = 1;
			var isPickupAllow = oDashboardTabModel.getProperty("/sourceInfoDtos/"+primaryVenIndex+"/sourceInfoDto/doSrcAllowCustPickup");
			if(isPickupAllow){
				oDashboardTabModel.setProperty("/commercialFinanceDto/isPickUpText","PickUp Cost");
			}else{
				oDashboardTabModel.setProperty("/commercialFinanceDto/isPickUpText","Delivered Cost");
			}
			var primaryVName = oDashboardTabModel.getProperty("/sourceInfoDtos/"+primaryVenIndex+"/sourceInfoDto/vendorName");
			var primaryVId = oDashboardTabModel.getProperty("/sourceInfoDtos/"+primaryVenIndex+"/sourceInfoDto/vendorNumber");
			oDashboardTabModel.setProperty("/commercialFinanceDto/primaryVName",primaryVName);
			oDashboardTabModel.setProperty("/commercialFinanceDto/primaryVId",primaryVId);
			this.getVenDataFromCostsheet(primaryVenIndex,"Primary",isPickupAllow);//get Primary vendor Data
			if(sourceInfoDtosData.length > 1){
				this.secondaryVendAvail = true;
				var secondaryVName = oDashboardTabModel.getProperty("/sourceInfoDtos/"+secondaryVenIndex+"/sourceInfoDto/vendorName");
				var secondaryVId =oDashboardTabModel.getProperty("/sourceInfoDtos/"+secondaryVenIndex+"/sourceInfoDto/vendorNumber");
				oDashboardTabModel.setProperty("/commercialFinanceDto/secondaryVName",secondaryVName);
				oDashboardTabModel.setProperty("/commercialFinanceDto/secondaryVId",secondaryVId);
				oCFMValuesModel.setProperty("/isSecondVenVisible",true);
				oCFMValuesModel.setProperty("/isCFMGridDSpan","XL4 L4 M6 S12");
				this.getVenDataFromCostsheet(secondaryVenIndex,"Secondary",isPickupAllow);//get Secondary Vendor Data
			}else{
				this.secondaryVendAvail = false;
				oCFMValuesModel.setProperty("/isSecondVenVisible",false);
				oCFMValuesModel.setProperty("/isCFMGridDSpan","XL6 L6 M6 S12");
			}
			
			var pricePerEach = oDashboardTabModel.getProperty("/merchandisingDto/marketFinalPriceEA");
			var pricePerCase = oDashboardTabModel.getProperty("/merchandisingDto/marketFinalPriceCS");
			var avgForcastWeekDemand = oDashboardTabModel.getProperty("/merchandisingDto/avgWeekUnitDemand");
			var referenceMat = oDashboardTabModel.getProperty("/merchandisingDto/materialNo");
			var referenceMatDesc = oDashboardTabModel.getProperty("/merchandisingDto/materialNoDescription");
			oDashboardTabModel.setProperty("/commercialFinanceDto/pricePerEach",pricePerEach);
			oDashboardTabModel.setProperty("/commercialFinanceDto/pricePerCase",pricePerCase);
			oDashboardTabModel.setProperty("/commercialFinanceDto/avgForcastWeekDemand",avgForcastWeekDemand);
			oDashboardTabModel.setProperty("/commercialFinanceDto/referenceMat",referenceMat);
			oDashboardTabModel.setProperty("/commercialFinanceDto/referenceMatDesc",referenceMatDesc);
			this.calculateGrossMargin();//Function Call For GrossMargin
			var pMinOrderQuantity = oDashboardTabModel.getProperty("/sourceInfoDtos/"+primaryVenIndex+"/orderInfoDto/minItemOrderQuantity");
			oDashboardTabModel.setProperty("/commercialFinanceDto/pMinOrderQuantity",pMinOrderQuantity);
			if(this.secondaryVendAvail){
				var sMinOrderQuantity = oDashboardTabModel.getProperty("/sourceInfoDtos/"+secondaryVenIndex+"/orderInfoDto/minItemOrderQuantity");
				oDashboardTabModel.setProperty("/commercialFinanceDto/sMinOrderQuantity",sMinOrderQuantity);
			}
			this.calculateGMROI();//Function Call For GMROI
			this.getNpvAndIRR();//Function Call For NPV and IRR
			
			oDashboardTabModel.setProperty("/commercialFinanceDto/pCfmAdjustNetEditable", true);
			oDashboardTabModel.setProperty("/commercialFinanceDto/sCfmAdjustNetEditable", true);
			oDashboardTabModel.setProperty("/commercialFinanceDto/pCfmAdjustPerEditable", true);
			oDashboardTabModel.setProperty("/commercialFinanceDto/sCfmAdjustPerEditable", true);
			oDashboardTabModel.refresh();
			oCFMValuesModel.refresh();
		},
		
		//Function To Get Data For Tier Gross Margin
		getTierGrossMarginPer: function(){
			var that = this;
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel =  this.oDashboardTabModel;
			
			var tier1 = oDashboardTabModel.getProperty("/commercialFinanceDto/idtnTier1Val");
			var tier2 = oDashboardTabModel.getProperty("/commercialFinanceDto/idtnTier2Val");
			var tier3 = oDashboardTabModel.getProperty("/commercialFinanceDto/idtnTier3Val");
			var tier4 = oDashboardTabModel.getProperty("/commercialFinanceDto/idtnTier4Val");
			var payload ={
					"tier1":tier1,
					"tier2":tier2,
					"tier3":tier3,
					"tier4":tier4
				};
			
			var sUrl = "/sku/api/dw/categorygrossmargin";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(payload), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oEvent.getSource().getData();
					oDashboardTabModel.setProperty("/commercialFinanceDto/categoryGrossMarginTier1",resultData.categoryGrossMarginTier1);
					oDashboardTabModel.setProperty("/commercialFinanceDto/categoryGrossMarginTier2",resultData.categoryGrossMarginTier2);
					oDashboardTabModel.setProperty("/commercialFinanceDto/categoryGrossMarginTier3",resultData.categoryGrossMarginTier3);
					oDashboardTabModel.setProperty("/commercialFinanceDto/categoryGrossMarginTier4",resultData.categoryGrossMarginTier4);
				} else {
					var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
					util.toastMessage(errorText);
				}
				that.busy.close();
			});

			oModel.attachRequestFailed(function(oEvent) {
				that.busy.close();
				var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				util.toastMessage(errorText);
				that.busy.close();
			});
		},
		
		//Function to getData of primary and Secondary Vendor For CFM from CostSheet
		getVenDataFromCostsheet: function(vendIndex,vendType,isPickupAllow){
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var srcInfoDtoData = oDashboardTabModel.getProperty("/sourceInfoDtos");
			if(srcInfoDtoData.length){
			var condTypeDtosData = oDashboardTabModel.getProperty("/sourceInfoDtos/"+vendIndex+"/costSheetDto/conditionTypeDtos");
			var lowerHdrCostDtoData = oDashboardTabModel.getProperty("/sourceInfoDtos/"+vendIndex+"/costSheetDto/lowerHeaderCostAndDiscountDtos");
			var npcDtoData = oDashboardTabModel.getProperty("/sourceInfoDtos/"+vendIndex+"/costSheetDto/npcDtos");
			if(condTypeDtosData.length){
				for(var i = 0; i<condTypeDtosData.length; i++){
					if(condTypeDtosData[i].pricingType === "01. Net Item Cost Pre-Header Fees"){
						if(isPickupAllow){
							var preHdrFeeCostUom = condTypeDtosData[i].pickupCostPerCase;
							var preHdrFeeCostUnit = condTypeDtosData[i].pickupCostPerEach;
						}else{
							var preHdrFeeCostUom = condTypeDtosData[i].deliveryCostPerCase;
							var preHdrFeeCostUnit = condTypeDtosData[i].deliveryCostPerEach;
						}
					}
				}
			}
			if(lowerHdrCostDtoData.length){
				for(var i = 0; i<lowerHdrCostDtoData.length; i++){
					if(lowerHdrCostDtoData[i].costCategory === "02. Net Item Cost Post-Header Fees"){
						if(isPickupAllow){
							var postHdrFeeCostUom = lowerHdrCostDtoData[i].pickupCostPerCase;
							var postHdrFeeCostUnit = lowerHdrCostDtoData[i].pickupCostPerEach;
						}else{
							var postHdrFeeCostUom = lowerHdrCostDtoData[i].deliveryCostPerCase;
							var postHdrFeeCostUnit = lowerHdrCostDtoData[i].deliveryCostPerEach;
						}
					}
					if(lowerHdrCostDtoData[i].costCategory === "03. Net Item Cost post Header Fees and Accruals "){
						if(isPickupAllow){
							var postHdrFeeAccrCostUom = lowerHdrCostDtoData[i].pickupCostPerCase;
							var postHdrFeeAccrCostUnit = lowerHdrCostDtoData[i].pickupCostPerEach;
						}else{
							var postHdrFeeAccrCostUom = lowerHdrCostDtoData[i].deliveryCostPerCase;
							var postHdrFeeAccrCostUnit = lowerHdrCostDtoData[i].deliveryCostPerEach;
						}
					}
					if(lowerHdrCostDtoData[i].costCategory === "04. Net Item Cost Post-Header Fees and EPD"){
						if(isPickupAllow){
							var postHdrFeeEpdCostUom = lowerHdrCostDtoData[i].pickupCostPerCase;
							var postHdrFeeEpdCostUnit = lowerHdrCostDtoData[i].pickupCostPerEach;
						}else{
							var postHdrFeeEpdCostUom = lowerHdrCostDtoData[i].deliveryCostPerCase;
							var postHdrFeeEpdCostUnit = lowerHdrCostDtoData[i].deliveryCostPerEach;
						}
					}
				}
			}
			if(npcDtoData.length){
				for(var i = 0; i<npcDtoData.length; i++){
					if(npcDtoData[i].costCategory === "05. Dead Net Item Inbound Cost"){
						if(isPickupAllow){
							var deadInboundCostUom = npcDtoData[i].pickupCostPerCase;
							var deadInboundCostUnit = npcDtoData[i].pickupCostPerEach;
						}else{
							var deadInboundCostUom = npcDtoData[i].deliveryCostPerCase;
							var deadInboundCostUnit = npcDtoData[i].deliveryCostPerEach;
						}
					}
				}
			}
			if(vendType === "Primary"){
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPreHdrFeeCostUom", preHdrFeeCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPreHdrFeeCostUnit", preHdrFeeCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPostHdrFeeCostUom", postHdrFeeCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPostHdrFeeCostUnit", postHdrFeeCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPostHdrFeeAccrCostUom",postHdrFeeAccrCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPostHdrFeeAccrCostUnit",postHdrFeeAccrCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPostHdrFeeEpdCostUom",postHdrFeeEpdCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVenPostHdrFeeEpdCostUnit",postHdrFeeEpdCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendDeadInboundCostUom",deadInboundCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendDeadInboundCostUnit",deadInboundCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendCalDeadInboundCostUom",deadInboundCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendCalDeadInboundCostUnit",deadInboundCostUnit.toFixed(2));
			}else{
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPreHdrFeeCostUom", preHdrFeeCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPreHdrFeeCostUnit", preHdrFeeCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPostHdrFeeCostUom", postHdrFeeCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPostHdrFeeCostUnit", postHdrFeeCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPostHdrFeeAccrCostUom",postHdrFeeAccrCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPostHdrFeeAccrCostUnit",postHdrFeeAccrCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPostHdrFeeEpdCostUom",postHdrFeeEpdCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVenPostHdrFeeEpdCostUnit",postHdrFeeEpdCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendDeadInboundCostUom",deadInboundCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendDeadInboundCostUnit",deadInboundCostUnit.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendCalDeadInboundCostUom",deadInboundCostUom.toFixed(2));
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendCalDeadInboundCostUnit",deadInboundCostUnit.toFixed(2));
			}
			oDashboardTabModel.refresh();
			oCFMValuesModel.refresh();
			}
		},
		
		//Function to calculate Gross margin and grossMargin%
		calculateGrossMargin: function(){
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var pVendDeadNetItemUom = oDashboardTabModel.getProperty("/commercialFinanceDto/pVendDeadInboundCostUom");
			if(pVendDeadNetItemUom){
				if(pVendDeadNetItemUom !== null && pVendDeadNetItemUom !== ""){
					pVendDeadNetItemUom = parseFloat(pVendDeadNetItemUom);
			var pVendDeadNetItemUnit = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pVendDeadInboundCostUnit"));
			if(this.secondaryVendAvail){
				var sVendDeadNetItemUom = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/sVendDeadInboundCostUom"));
				var sVendDeadNetItemUnit = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/sVendDeadInboundCostUnit"));
			}else{
				var sVendDeadNetItemUom = 0;
				var sVendDeadNetItemUom = 0;
			}
			var priceUnit = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pricePerEach"));
			var priceUom = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pricePerCase"));
			if(priceUnit === "NaN" || priceUnit === NaN){
				priceUnit = 0;
			}
			if(priceUom === "NaN" || priceUom === NaN){
				priceUom = 0;
			}
			var pGrossMarginUom = priceUom - pVendDeadNetItemUom;
			var pGrossMarginUnit = priceUnit - pVendDeadNetItemUnit;
			var sGrossMarginUom = priceUom - sVendDeadNetItemUom;
			var sGrossMarginUnit = priceUnit - sVendDeadNetItemUnit;
			var pGrossMarginPercent = (pGrossMarginUom/priceUom)*100;
			var sGrossMarginPercent = (sGrossMarginUom/priceUom)*100;
			oDashboardTabModel.setProperty("/commercialFinanceDto/pGrossMarginUom", pGrossMarginUom.toFixed(2));
			oDashboardTabModel.setProperty("/commercialFinanceDto/pGrossMarginUnit",pGrossMarginUnit.toFixed(2));
			oDashboardTabModel.setProperty("/commercialFinanceDto/sGrossMarginUom", sGrossMarginUom.toFixed(2));
			oDashboardTabModel.setProperty("/commercialFinanceDto/sGrossMarginUnit", sGrossMarginUnit.toFixed(2));
			oDashboardTabModel.setProperty("/commercialFinanceDto/pGrossMarginPercent", pGrossMarginPercent.toFixed(2));
			oDashboardTabModel.setProperty("/commercialFinanceDto/sGrossMarginPercent", sGrossMarginPercent.toFixed(2));
			oDashboardTabModel.refresh();
				}
			}
		},
		
		//Function to create temp Data for testing need to delete this function later
		setTempDataForCFM:function(){
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var oCFMValuesModel = this.oCFMValuesModel;
			
			oDashboardTabModel.setProperty("/commercialFinanceDto/ideationDto/tier1","Dairy");
			oDashboardTabModel.setProperty("/commercialFinanceDto/ideationDto/tier2","Dips and Spreads Refrigerated");
			oDashboardTabModel.setProperty("/commercialFinanceDto/ideationDto/tier3","Beans Dips Rfdg");
			oDashboardTabModel.setProperty("/commercialFinanceDto/ideationDto/tier4","All Beans Dips Rfdg");
			
		},
		
		//Function to calculate GMROI value on Change of Average weekly Unit Demand
		onChangeCFMAvgWeeklyDemand: function(oEvent) {
			this.getNpvAndIRR();
		},
		
		//Function To Calculate value of NPV_EA and NPV_CS and IRR
		getNpvAndIRR: function(){
			var that = this;
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			
			var AvrgWeeklyDemand = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/avgForcastWeekDemand"));
			var pMOQ = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pMinOrderQuantity"));
			var noOfWeeks = (pMOQ / AvrgWeeklyDemand).toFixed;
			var pCostEA = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pVendCalDeadInboundCostUnit"));
			var pPriceEA = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pricePerEach"));
			var investment = (pCostEA * pMOQ).toFixed(2);
			var payLoad = {
				"averageWeeklyDemand":	AvrgWeeklyDemand,
				"minimumOrderQuantity": pMOQ,
				"pricePerEach": pPriceEA,
				"costPerEach":pCostEA
			};
			
			var sUrl = "/sku/api/validation/NPC/IRR/calculation";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(payLoad), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oEvent.getSource().getData();
					oDashboardTabModel.setProperty("/commercialFinanceDto/npvPerCS",resultData.netPresentValue);
					oDashboardTabModel.setProperty("/commercialFinanceDto/npvPerEA", 1.47);
					oDashboardTabModel.setProperty("/commercialFinanceDto/irr",resultData.internalReturnRate);
				} else {
					var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
					util.toastMessage(errorText);
				}
				that.busy.close();
			});

			oModel.attachRequestFailed(function(oEvent) {
				that.busy.close();
				var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				util.toastMessage(errorText);
				that.busy.close();
			});
			
		},
		
		//Function To Calculate GMROI Value
		calculateGMROI: function() {
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var pMOQ = oDashboardTabModel.getProperty("/commercialFinanceDto/pMinOrderQuantity");
			var pPriceEA = oDashboardTabModel.getProperty("/commercialFinanceDto/pricePerEach");
			var pCostEA = oDashboardTabModel.getProperty("/commercialFinanceDto/pVendCalDeadInboundCostUnit");
			if(pMOQ && pPriceEA && pPriceEA ){
				if(pMOQ !== NaN && pMOQ !== NaN && pMOQ !== NaN){
					pMOQ = parseFloat(pMOQ);
					pPriceEA = parseFloat(pPriceEA);
					pCostEA = parseFloat(pCostEA);
			if(this.secondaryVendAvail){
				var sMOQ = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/sMinOrderQuantity"));
				var sPriceEA = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pricePerEach"));
				var sCostEA = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/sVendCalDeadInboundCostUnit"));
			}else{
				var sMOQ = 0;
				var sPriceEA = 0;
				var sCostEA = 0;
			}
			var AvrgWeeklyDemand = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/avgForcastWeekDemand"));
			var tier3GrossMarginPer = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/tier3MarginPercent"));
			var pGrossMarginPercent = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pGrossMarginPercent"));
			
			var timeForStockToFinish = pMOQ / AvrgWeeklyDemand;
			var pMarginPerEA = pPriceEA - pCostEA;
			var sMarginPerEA = sPriceEA - sCostEA;
			var grossMarginOverTenWeek = pMOQ * pMarginPerEA;
			var avgInventoryCost = 0.5 * pMOQ * pCostEA;
			var GMROI = (grossMarginOverTenWeek * avgInventoryCost).toFixed(2);
			
			var AnnlGainLossPvsSVal = ((52 * pMOQ * pMarginPerEA) - (52 * sMOQ * sMarginPerEA)).toFixed(2);
			var AnnlGainLossCategory = (((52 * pMOQ * pGrossMarginPercent) / 100) - ((52 * pMOQ * tier3GrossMarginPer) / 100)).toFixed(2);
			
			oDashboardTabModel.setProperty("/commercialFinanceDto/gmroi", GMROI);
			oDashboardTabModel.setProperty("/commercialFinanceDto/annulDollarGainLossPriSec", AnnlGainLossPvsSVal);
			oDashboardTabModel.setProperty("/commercialFinanceDto/annulDollarGainLossInCategory", AnnlGainLossCategory);
			oDashboardTabModel.refresh();
				}
			}
		},
		
		//Function to calculate NetItem Inbound Cost on Change CFM AdjustMent netValue for Primary Vendor
		onChangePriCFMAdjustNet: function(oEvent){
			var oValue = oEvent.getSource().getValue();
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			if (oValue === "" || oValue === undefined) {
				oDashboardTabModel.setProperty("/commercialFinanceDto/pCfmAdjustPerEditable", true);
				
			}else{
				oValue = parseFloat(oValue);
				var deadInboundCostUom = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pVendDeadInboundCostUom"));
				var calDeadNetCostUom = (deadInboundCostUom - oValue).toFixed(2);
				var calDeadNetCostUnit = (calDeadNetCostUom / 12).toFixed(2);
				oDashboardTabModel.setProperty("/commercialFinanceDto/pCfmAdjustPerEditable", false);
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendCalDeadInboundCostUom", calDeadNetCostUom);
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendCalDeadInboundCostUnit", calDeadNetCostUnit);
			}
			oCFMValuesModel.refresh();
			oDashboardTabModel.refresh();
			this.calculateGrossMargin();
			this.calculateGMROI();
		},
		
		//Function to calculate NetItem Inbound Cost on Change CFM AdjustMent netValue for secondary Vendor
		onChangeSecCFMAdjustNet: function(oEvent){
			var oValue = oEvent.getSource().getValue();
			var oCFMValuesModel = this.oCFMValuesModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			if (oValue === "" || oValue === undefined) {
				oDashboardTabModel.setProperty("/commercialFinanceDto/sCfmAdjustPerEditable", true);
			}else{
				oValue = parseFloat(oValue);
				var deadInboundCostUom = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/sVendDeadInboundCostUom"));
				var calDeadNetCostUom = (deadInboundCostUom - oValue).toFixed(2);
				var calDeadNetCostUnit = (calDeadNetCostUom / 12).toFixed(2);
				oDashboardTabModel.setProperty("/commercialFinanceDto/sCfmAdjustPerEditable", false);
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendCalDeadInboundCostUom", calDeadNetCostUom);
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendCalDeadInboundCostUnit", calDeadNetCostUnit);
			}
			oDashboardTabModel.refresh();
			this.calculateGrossMargin();
			this.calculateGMROI();
		},
		
		//Function to calculate NetItem Inbound Cost on Change CFM AdjustMent Percent for Primary Vendor
		onChangePriCFMAdjustPerc: function(oEvent){
			var oValue = oEvent.getSource().getValue();
			var oDashboardTabModel = this.oDashboardTabModel;
			if (oValue === "" || oValue === undefined) {
				oDashboardTabModel.setProperty("/commercialFinanceDto/pCfmAdjustNetEditable", true);
			}else{
				oValue = parseFloat(oValue);
				var deadInboundCostUom = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/pVendDeadInboundCostUom"));
				var calDeadNetCostUom = (deadInboundCostUom - (oValue * (deadInboundCostUom / 100))).toFixed(2);
				var calDeadNetCostUnit = (calDeadNetCostUom / 12).toFixed(2);
				oDashboardTabModel.setProperty("/commercialFinanceDto/pCfmAdjustNetEditable", false);
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendCalDeadInboundCostUom", calDeadNetCostUom);
				oDashboardTabModel.setProperty("/commercialFinanceDto/pVendCalDeadInboundCostUnit", calDeadNetCostUnit);
			}
			oDashboardTabModel.refresh();
			this.calculateGrossMargin();
			this.calculateGMROI();
		
		},
		
		//Function to calculate NetItem Inbound Cost on Change CFM AdjustMent Percent for Secondary Vendor
		onChangeSecCFMAdjustPerc: function(oEvent){

			var oValue = oEvent.getSource().getValue();
			var oDashboardTabModel = this.oDashboardTabModel;
			if (oValue === "" || oValue === undefined) {
				oDashboardTabModel.setProperty("/commercialFinanceDto/sCfmAdjustNetEditable", true);
			}else{
				oValue = parseFloat(oValue);
				var deadInboundCostUom = parseFloat(oDashboardTabModel.getProperty("/commercialFinanceDto/sVendDeadInboundCostUom"));
				var calDeadNetCostUom = (deadInboundCostUom - (oValue * (deadInboundCostUom / 100))).toFixed(2);
				var calDeadNetCostUnit = (calDeadNetCostUom / 12).toFixed(2);
				oDashboardTabModel.setProperty("/commercialFinanceDto/sCfmAdjustNetEditable", false);
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendCalDeadInboundCostUom", calDeadNetCostUom);
				oDashboardTabModel.setProperty("/commercialFinanceDto/sVendCalDeadInboundCostUnit", calDeadNetCostUnit);
			}
			oDashboardTabModel.refresh();
			this.calculateGrossMargin();
			this.calculateGMROI();
		},
		
		//Function To Approve CFM Task
		onApproveCFMTask: function(oEvent){
			var oSource = oEvent.getSource();
		},
		
		//Function To Reject CFM Task
		onApproveCFMTask: function(oEvent){
			var oSource = oEvent.getSource();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CFM_TAB-END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
	
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<MERCHANDISING_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to set temporary data structure for forecast in buom table
		createForecastTblData: function() {
			var oMerchandisingModel = this.oMerchandisingModel;
			var rows = [{
				"week1Input": "",
				"week2Input": "",
				"week3Input": "",
				"week4Input": "",
				"week5Input": "",
				"week6Input": "",
				"week1Text": "",
				"week2Text": "",
				"week3Text": "",
				"week4Text": "",
				"week5Text": "",
				"week6Text": "",
				"inputVisible": true,
				"textVisible": false
			}, {
				"week1Input": "",
				"week2Input": "",
				"week3Input": "",
				"week4Input": "",
				"week5Input": "",
				"week6Input": "",
				"week1Text": "",
				"week2Text": "",
				"week3Text": "",
				"week4Text": "",
				"week5Text": "",
				"week6Text": "",
				"inputVisible": false,
				"textVisible": true
			}];
			oMerchandisingModel.setProperty("/wkForecastData", rows);
			this.resetRefMatPopUpFields();
			oMerchandisingModel.refresh();
		},

		//Function to calculate weekly forecast based on reference sku selected
		calulateWeeklyForecast: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oMerchandisingModel = this.oMerchandisingModel;

			var fieldName = oEvent.getSource().getName();
			var oPercentage = oEvent.getSource().getValue();
			oPercentage = parseInt(oPercentage);

			var avgWeeklyDemand = oDashboardTabModel.getProperty("/merchandisingDto/avgWeekUnitDemand");
			avgWeeklyDemand = parseInt(avgWeeklyDemand);
			var weeklyForecast = (oPercentage / 100) * avgWeeklyDemand;
			weeklyForecast = Math.ceil(weeklyForecast);
			weeklyForecast = weeklyForecast.toString();
			if (weeklyForecast === "NaN") {
				weeklyForecast = "";
			}

			oPercentage = oPercentage.toString();
			if (!oPercentage.includes("%")) {
				oPercentage = oPercentage + "%";
			}

			switch (fieldName) {
				case "WEEK1":
					oMerchandisingModel.setProperty("/wkForecastData/1/week1Text", weeklyForecast);
					oMerchandisingModel.setProperty("/wkForecastData/0/week1Input", oPercentage);
					oDashboardTabModel.setProperty("/merchandisingDto/forecastBUOMWeek1", weeklyForecast);
					break;
				case "WEEK2":
					oMerchandisingModel.setProperty("/wkForecastData/1/week2Text", weeklyForecast);
					oMerchandisingModel.setProperty("/wkForecastData/0/week2Input", oPercentage);
					oDashboardTabModel.setProperty("/merchandisingDto/forecastBUOMWeek2", weeklyForecast);
					break;
				case "WEEK3":
					oMerchandisingModel.setProperty("/wkForecastData/1/week3Text", weeklyForecast);
					oMerchandisingModel.setProperty("/wkForecastData/0/week3Input", oPercentage);
					oDashboardTabModel.setProperty("/merchandisingDto/forecastBUOMWeek3", weeklyForecast);
					break;
				case "WEEK4":
					oMerchandisingModel.setProperty("/wkForecastData/1/week4Text", weeklyForecast);
					oMerchandisingModel.setProperty("/wkForecastData/0/week4Input", oPercentage);
					oDashboardTabModel.setProperty("/merchandisingDto/forecastBUOMWeek4", weeklyForecast);
					break;
				case "WEEK5":
					oMerchandisingModel.setProperty("/wkForecastData/1/week5Text", weeklyForecast);
					oMerchandisingModel.setProperty("/wkForecastData/0/week5Input", oPercentage);
					oDashboardTabModel.setProperty("/merchandisingDto/forecastBUOMWeek5", weeklyForecast);
					break;
				case "WEEK6":
					oMerchandisingModel.setProperty("/wkForecastData/1/week6Text", weeklyForecast);
					oMerchandisingModel.setProperty("/wkForecastData/0/week6Input", oPercentage);
					oDashboardTabModel.setProperty("/merchandisingDto/forecastBUOMWeek6", weeklyForecast);
					break;
			}
			oMerchandisingModel.refresh();
			oDashboardTabModel.refresh();
		},

		onAvgWeeklyUniDemandChange: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oMerchandisingModel = this.oMerchandisingModel;

			var avgWeeklyDemand = oDashboardTabModel.getProperty("/merchandisingDto/avgWeekUnitDemand");
			avgWeeklyDemand = parseInt(avgWeeklyDemand);

			var oWeek1Input = oMerchandisingModel.getProperty("/wkForecastData/0/week1Input");
			this.calForecastOnAvgUnitDemand(oWeek1Input, avgWeeklyDemand, "forecastBUOMWeek1", "week1Text");

			var oWeek2Input = oMerchandisingModel.getProperty("/wkForecastData/0/week2Input");
			this.calForecastOnAvgUnitDemand(oWeek2Input, avgWeeklyDemand, "forecastBUOMWeek2", "week2Text");

			var oWeek3Input = oMerchandisingModel.getProperty("/wkForecastData/0/week3Input");
			this.calForecastOnAvgUnitDemand(oWeek3Input, avgWeeklyDemand, "forecastBUOMWeek3", "week3Text");

			var oWeek4Input = oMerchandisingModel.getProperty("/wkForecastData/0/week4Input");
			this.calForecastOnAvgUnitDemand(oWeek4Input, avgWeeklyDemand, "forecastBUOMWeek4", "week4Text");

			var oWeek5Input = oMerchandisingModel.getProperty("/wkForecastData/0/week5Input");
			this.calForecastOnAvgUnitDemand(oWeek5Input, avgWeeklyDemand, "forecastBUOMWeek5", "week5Text");

			var oWeek6Input = oMerchandisingModel.getProperty("/wkForecastData/0/week6Input");
			this.calForecastOnAvgUnitDemand(oWeek6Input, avgWeeklyDemand, "forecastBUOMWeek6", "week6Text");
			
			this.onChangeAvgWeekUnitDemand(avgWeeklyDemand);
		},

		//Function to calculate avg unit demand
		calForecastOnAvgUnitDemand: function(oWeekInput, avgWeeklyDemand, tabModelPath, forecastModelPath) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oMerchandisingModel = this.oMerchandisingModel;
			var oWeekInput = parseInt(oWeekInput);
			var weekForecast = (oWeekInput / 100) * avgWeeklyDemand;
			weekForecast = weekForecast.toString();
			if (weekForecast === "NaN") {
				weekForecast = "";
			}
			oMerchandisingModel.setProperty("/wkForecastData/1/" + forecastModelPath, weekForecast);
			oDashboardTabModel.setProperty("/merchandisingDto/" + tabModelPath, weekForecast);
			oMerchandisingModel.refresh();
			oDashboardTabModel.refresh();
			return;
		},

		//Function to open reference material selection pop-up
		onRefMatDialogOpen: function(oEvent) {
			if (!this.refMatValueHelp) {
				this.refMatValueHelp = sap.ui.xmlfragment("freshdirect.SKU.fragments.refMatValueHelp", this);
				this.getView().addDependent(this.refMatValueHelp);
			}
			this.refMatValueHelp.open();
			var oMerchandisingModel = this.oMerchandisingModel;
			var oDashboardTabModel = this.oDashboardTabModel;
			var tier1 = oDashboardTabModel.getProperty("/ideationDto/tier1");
			oMerchandisingModel.setProperty("/tier1", "Dairy");
			this.onTier1Selection("", "Dairy");
		},

		//Function to close reference material selection pop-up
		closeReferenceMatPopUp: function() {
			this.refMatValueHelp.close();
			this.resetRefMatPopUpFields();
		},

		//Function to search reference material number from pop-up
		searchReferenceMatNumber: function() {

			var that = this;
			this.busy.open();
			var oMerchandisingModel = this.oMerchandisingModel;
			var refBrand = oMerchandisingModel.getProperty("/referenceBrand");
			var refmatNum = oMerchandisingModel.getProperty("/referenceMaterialNumber");
			var tier1 = oMerchandisingModel.getProperty("/tier1");
			var tier2 = oMerchandisingModel.getProperty("/tier2");
			var tier3 = oMerchandisingModel.getProperty("/tier3");
			var tier4 = oMerchandisingModel.getProperty("/tier4");

			var oPayload = {
				"brand": refBrand,
				"materialDesc": "",
				"materialNo": refmatNum,
				"tier1": tier1,
				"tier2": tier2,
				"tier3": tier3,
				"tier4": tier4
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/sku/api/dw/referencematerialsearch", JSON.stringify(oPayload), true, "POST", false, false, this.oHeader);
			
			oModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					var referenceMaterials = oEvent.getSource().getData().materials;
					referenceMaterials = formatter.convertObjectToArray(referenceMaterials);
					oMerchandisingModel.setProperty("/referenceMaterials", referenceMaterials);
					that.generatePagination();
				} else {
					var errorText = "Error in fetching reference material numbers";
					util.toastMessage(errorText);
				}
				that.busy.close();
			});

			oModel.attachRequestFailed(function(oEvent) {
				var errorText = "Error in fetching reference material numbers";
				that.busy.close();
				util.toastMessage(errorText);
			});
		},

		//Function to generate pagination on search of a reference material number
		generatePagination: function() {

			var oPaginationModel = this.oPaginationModel;
			var oMerchandisingModel = this.oMerchandisingModel;
			var referenceMaterials = oMerchandisingModel.getProperty("/referenceMaterials");

			var countPerPage = "8";
			var totalResults = referenceMaterials.length;

			oPaginationModel.setProperty("/prevBtnVisible", false);
			oPaginationModel.setProperty("/nextBtnVisible", true);

			var pageCount = parseInt(totalResults / countPerPage);
			if (totalResults % countPerPage !== 0) {
				pageCount = pageCount + 1;
			}
			oPaginationModel.setProperty("/numberOfPages", pageCount);

			var array = [];
			if (pageCount > 5) {
				pageCount = 5;
			} else {
				oPaginationModel.setProperty("/nextBtnVisible", false);
			}

			for (var i = 1; i <= pageCount; i++) {
				var object = {
					"text": i
				};
				array.push(object);
			}

			oPaginationModel.setProperty("/counters", array);
			oPaginationModel.setProperty("/selectedPage", "1");
			oPaginationModel.refresh(true);
		},

		//Function to scroll left for pagination in reference material pop-up
		onScrollLeft: function() {

			var oPaginationModel = this.oPaginationModel;
			oPaginationModel.setProperty("/prevBtnVisible", true);
			oPaginationModel.setProperty("/nextBtnVisible", true);

			var paginatedData = oPaginationModel.getProperty("/counters");
			var selectedPage = parseInt(oPaginationModel.getProperty("/selectedPage"));
			var startValue = parseInt(paginatedData[0].text);
			var startNumber = 1;
			var array = [];

			if ((startValue - 1) === 1) {
				startNumber = 1;
				oPaginationModel.setProperty("/prevBtnVisible", false);
			} else {
				startNumber = selectedPage - 3;
			}

			for (var i = startNumber; i <= (startNumber + 4); i++) {
				var object = {
					"text": i
				};
				array.push(object);
			}
			oPaginationModel.setProperty('/counters', array);
			oPaginationModel.setProperty("/selectedPage", (selectedPage - 1));
		},

		//Function to scroll right for pagination in reference material pop-up
		onScrollRight: function() {

			var oPaginationModel = this.oPaginationModel;
			oPaginationModel.setProperty("/prevBtnVisible", true);
			oPaginationModel.setProperty("/nextBtnVisible", true);

			var selectedPage = parseInt(oPaginationModel.getProperty("/selectedPage"));
			var startNumber = 1;
			var array = [];
			if (selectedPage > 2) {
				if ((selectedPage + 3) >= oPaginationModel.getProperty("/numberOfPages")) {
					oPaginationModel.setProperty("/nextBtnVisible", false);
					startNumber = parseInt(oPaginationModel.getProperty("/numberOfPages")) - 4;
				} else {
					startNumber = selectedPage - 1;
				}
			} else {
				oPaginationModel.setProperty("/prevBtnVisible", false);
			}
			for (var i = startNumber; i <= (startNumber + 4); i++) {
				var object = {
					"text": i
				};
				array.push(object);
			}
			oPaginationModel.setProperty('/counters', array);
			oPaginationModel.setProperty("/selectedPage", (selectedPage + 1));
		},

		//Function to clear field values in reference material pop-up
		resetRefMatPopUpFields: function() {

			var oMerchandisingModel = this.oMerchandisingModel;
			oMerchandisingModel.setProperty("/referenceMaterials", []);
			oMerchandisingModel.setProperty("/referenceMaterialNumber", "");
			oMerchandisingModel.setProperty("/referenceBrand", "");
			oMerchandisingModel.setProperty("/tier1", "");
			oMerchandisingModel.setProperty("/tier2", "");
			oMerchandisingModel.setProperty("/tier3", "");
			oMerchandisingModel.setProperty("/tier4", "");
			oMerchandisingModel.refresh();
		},

		
		getRefMatNumber:function(oEvent)
		{
			var refMatNum=oEvent.getSource().getValue();
			dropdownServices.getRefMatNumber(this,refMatNum);
		},

		//Function to select material number from reference magterial pop-up
		getSelectedRefMatNumber: function(oEvent) {
			
			var oDashboardTabModel = this.oDashboardTabModel;
			var oMerchandisingModel = this.oMerchandisingModel;

			var oMaterialNo = oEvent.getSource().getText();
			var sId = parseInt(oEvent.getSource().getParent().getId().split("-")[2]);			
			var sPath = "/referenceMaterials/" + sId;
			var oMaterialDesc = oMerchandisingModel.getProperty(sPath + "/materialDesc");
			var oRefAvgWeeklyUnitVol = oMerchandisingModel.getProperty(sPath + "/referenceAvgActWeeklyUnitvolume");

			oDashboardTabModel.setProperty("/merchandisingDto/materialNo", oMaterialNo);
			oDashboardTabModel.setProperty("/merchandisingDto/materialNoDescription", oMaterialDesc);
			oDashboardTabModel.setProperty("/merchandisingDto/referenceAvgActWeeklyUnitvolume", oRefAvgWeeklyUnitVol);
			oDashboardTabModel.refresh();
			this.refMatValueHelp.close();
			this.getAvgWeeklyUnitValue();
			this.onAvgWeeklyUniDemandChange();
		},
		
		//Function To set Binning Average Forcast Value on Chage of Average week Unit Demand in merchandizing
		onChangeAvgWeekUnitDemand: function(oVal){
			var oValue = oVal;
			var oDashboardTabModel = this.oDashboardTabModel;
			oDashboardTabModel.setProperty("/binningDto/avgForecasteWeeklyVolume", oValue);
			oDashboardTabModel.refresh();
		},
		
		getAvgWeeklyUnitValue: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			
			if(oEvent){
				var value = oEvent.getSource().getValue().split("%")[0];
				oDashboardTabModel.setProperty("/merchandisingDto/perSkuRefDemand",value);
			}

			var refAvgActWeeklyValue = oDashboardTabModel.getProperty("/merchandisingDto/referenceAvgActWeeklyUnitvolume");
			var perSkuRefDemandValue = oDashboardTabModel.getProperty("/merchandisingDto/perSkuRefDemand");

			var avgWeeklyUnitValue = (perSkuRefDemandValue / refAvgActWeeklyValue) * 100;
			oDashboardTabModel.setProperty("/merchandisingDto/avgWeekUnitDemand", avgWeeklyUnitValue);
			oDashboardTabModel.refresh();
			this.onAvgWeeklyUniDemandChange();
		},

		//function to set Percentage and Dollar values
		onInputValueChange: function(oEvent) {
			var value = oEvent.getSource().getValue();
			var bindingkey = oEvent.getSource().getBindingPath("value");
			var oEventSource = oEvent.getSource().getCustomData()[0].getValue();
			if (oEventSource === "TAB") {
				var oDashboardTabModel = this.oDashboardTabModel;
				oDashboardTabModel.setProperty(bindingkey, value);
				oDashboardTabModel.refresh();
			} else {
				var oDashboardTableModel = this.oDashboardTableModel;
				var sPath = oEvent.getSource().getBindingContext("oDashboardTableModel").getPath() + "/" + bindingkey;
				oDashboardTableModel.setProperty(sPath, value);
				oDashboardTableModel.refresh();
			}
			this.onChange(oEvent);
		},

		//Function to set Reference MateriL Number and Reference Material Description
		onSelectRefMatSuggesion: function(oEvent) {
			var src = oEvent.getSource();

			var refMatNum = oEvent.getParameters().selectedItem.getText();
			var refMatDesc = oEvent.getParameters().selectedItem.getAdditionalText();
			var oEventSource = oEvent.getSource().getCustonData()[0].getCustomValue();
			if (oEventSource === "MerchandisingTab") {
				var oDashboardTabModel = this.oDashboardTabModel;
				var sPath = oEvent.getSource().getBindingContext("oDashboardTabModel");
				oDashboardTabModel.setProperty(sPath + "/merchandisingDto/materialNo", selText);
				oDashboardTabModel.setProperty(sPath + "/merchandisingDto/materialNoDescription", selAddText);
			} else {
				var oDashboardTableModel = this.oDashboardTableModel;
				var sPath = oEvent.getSource().getBindingContext("oDashboardTableModel");
				oDashboardTableModel.setProperty(sPath + "/merchandisingDto/materialNo", selText);
				oDashboardTableModel.setProperty(sPath + "/merchandisingDto/materialNoDescription", selAddText);
			}

			oDashboardTabModel.refresh();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<MERCHANDISING_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<STORE_FRONT_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		// Function to open choosePlacement dialog
		openChoosePlacementDialog: function(oEvent) {
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel=this.oDashboardTabModel;
			var oDashboardVisibilityModel=this.oDashboardVisibilityModel;
			var placementPath=oEvent.getSource().getCustomData()[0].getValue();
			var actualPath = oDashboardTabModel.getProperty(placementPath + "/hierarchy");
			skuTempObjectModel.setProperty("/selectedPath",actualPath);
			skuTempObjectModel.setProperty("/placementPath",placementPath);
			skuTempObjectModel.setProperty("/taxonomy","");
			skuTempObjectModel.setProperty("/superDepartment","");
			skuTempObjectModel.setProperty("/department","");
			skuTempObjectModel.setProperty("/category","");
			skuTempObjectModel.setProperty("/subCategory","");
			skuTempObjectModel.setProperty("/subSubCategory","");
			skuTempObjectModel.setProperty("/choosePlacementTitle", "Taxonomy");
			var placementPathDto = oDashboardTabModel.getProperty(placementPath);
			var storeFrontPlcDto = oDashboardTabModel.getProperty("/storeFrontDto/storeFrontPlacementDtos");
			if(!placementPathDto){
				var obj={
						"taxonomy":"",
						"superDepartment":"",
						"department":"",
						"category":"",
						"subCategory":"",
						"subSubCategory":"",
						"placementType":""
				};
				storeFrontPlcDto.push(obj);
			}
			dropdownServices.getWebsites(this);
			if (!this.oAttributeDialog) {
				this.oAttributeDialog = sap.ui.xmlfragment("freshdirect.SKU.fragments.choosePlacement", this);
				this.getView().addDependent(this.oAttributeDialog);
			}
			oDashboardVisibilityModel.refresh();
			skuTempObjectModel.refresh();
			var navCon = sap.ui.getCore().byId("SF_NAV_CONTAINER");
			var target = sap.ui.getCore().byId("VIEW_1");
			oDashboardVisibilityModel.setProperty("/storeFrontBackVisible",false);
			if (actualPath !== undefined && actualPath !== null) {
			this.setNavContainerView(actualPath);
			} else {
			navCon.to(target,"flip");
			}
			this.oAttributeDialog.open();
		},
		
		//Function to set view in navContainer for selected placements
		setNavContainerView: function(actualPath) {
			var parts=actualPath.split(" > ");
			var navCon = sap.ui.getCore().byId("SF_NAV_CONTAINER");
			var target = sap.ui.getCore().byId("VIEW_1");
			navCon.to(target,"flip");
			var partsLen=parts.length;
			for (var i = 0; i < partsLen; i++) {
			this.sourceId="VIEW_"+(i+1);
			this.selectedStoreFront=parts[i];
			this.flipPlacementViews();
			}
			
		},
		
		//Function to Flip Views 
		flipPlacementViews: function(oEvent) {
			var that = this;
			var selectedkey, selectedText, sourceId, target;
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDropdownModel=this.oDropdownModel;
			var oDashboardTabModel=this.oDashboardTabModel;
			var oDashboardVisibilityModel=this.oDashboardVisibilityModel;
			
			var sPath=skuTempObjectModel.getProperty("/placementPath");
			var selectedPath = skuTempObjectModel.getProperty("/selectedPath");
			
			var parts = sPath.split("/");
			var sPathTemp = parts[2]+"/"+parts[3];
			
			var taxonomy=skuTempObjectModel.getProperty(sPathTemp+"/taxonomy");
			var superDepartment=skuTempObjectModel.getProperty(sPathTemp+"/superDepartment");
			var department=skuTempObjectModel.getProperty(sPathTemp+"/department");
			var category=skuTempObjectModel.getProperty(sPathTemp+"/category");
			var subCategory=skuTempObjectModel.getProperty(sPathTemp+"/subCategory");
			var subSubCategory=skuTempObjectModel.getProperty(sPathTemp+"/subSubCategory");
			
			oDashboardVisibilityModel.setProperty("/storeFrontBackVisible",true);
			
			if (oEvent) {
				var source = oEvent.getSource();
				sourceId = source.getParent().getId();
				selectedkey = source.getSelectedKey();
				selectedText = source.getSelectedItem().getText();
				} else {
				sourceId=this.sourceId;
				selectedkey=this.selectedStoreFront;
				if(sourceId === "VIEW_1"){
					selectedText = taxonomy;
				}else if(sourceId === "VIEW_2"){
					selectedText = superDepartment;
				}else if(sourceId === "VIEW_3"){
					selectedText = department;
				}else if(sourceId === "VIEW_4"){
					selectedText = category;
				}else if(sourceId === "VIEW_5"){
					selectedText = subCategory;
				}else if(sourceId === "VIEW_6"){
					selectedText = subSubCategory;
				}
				}
			
			var oServiceModel=new sap.ui.model.json.JSONModel();
			
			if (sourceId === "VIEW_1") {
				var sUrl = "/sku/api/dw/superdepartments";
				var oPayload={
						"estores":selectedkey
				};
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/superDepartments");
						data = formatter.convertObjectToArray(data);
						oDropdownModel.setProperty("/superDepartments", data);
					}
				});
				target = sap.ui.getCore().byId("VIEW_2");
				selectedPath = selectedText;
				oDashboardTabModel.setProperty(sPath+"/taxonomy",selectedkey);
				skuTempObjectModel.setProperty("/choosePlacementTitle","Super Department");
			}
			
			if (sourceId === "VIEW_2") {
				var sUrl = "/sku/api/dw/departments";
				var oPayload={
						"estores":taxonomy,
						"superDepartment":selectedkey
				};
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent){
					if (oEvent.getParameter("success")){
						var data = oEvent.getSource().getProperty("/departments");
						data = formatter.convertObjectToArray(data);
						oDropdownModel.setProperty("/departments", data);
					}
				});
				target = sap.ui.getCore().byId("VIEW_3");
				selectedPath=taxonomy+" > "+selectedText;
				oDashboardTabModel.setProperty(sPath+"/superDepartment",selectedkey);
				skuTempObjectModel.setProperty("/choosePlacementTitle","Department");
			}
			if (sourceId === "VIEW_3") {
				var sUrl = "/sku/api/dw/category";
				var oPayload={
						"estores":taxonomy,
						"superDepartment":superDepartment,
						"department":selectedkey
				};
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent){
					if (oEvent.getParameter("success")){
						var data = oEvent.getSource().getProperty("/category");
						data = formatter.convertObjectToArray(data);
						oDropdownModel.setProperty("/category", data);
					}
				});
				target = sap.ui.getCore().byId("VIEW_4");
				selectedPath=taxonomy+" > "+superDepartment+" > "+selectedText;
				oDashboardTabModel.setProperty(sPath+"/department",selectedkey);
				skuTempObjectModel.setProperty("/choosePlacementTitle","Category");
			}
			if (sourceId === "VIEW_4") {
				var sUrl = "/sku/api/dw/subcategories";
				var oPayload={
						"estores":taxonomy,
						"superDepartment":superDepartment,
						"department":department,
						"category":selectedkey
				};
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent){
					if (oEvent.getParameter("success")){
						var data = oEvent.getSource().getProperty("/subCategories");
						data = formatter.convertObjectToArray(data);
						oDropdownModel.setProperty("/subCategories", data);
					}
				});
				target = sap.ui.getCore().byId("VIEW_5");
				selectedPath=taxonomy+" > "+superDepartment+" > "+department+" > "+selectedText;
				oDashboardTabModel.setProperty(sPath+"/category",selectedkey);
				skuTempObjectModel.setProperty("/choosePlacementTitle","Sub Category");
			}
			if (sourceId === "VIEW_5") {
				var sUrl = "/sku/api/dw/subsubcategories";
				var oPayload={
						"estores":taxonomy,
						"superDepartment":superDepartment,
						"department":department,
						"category":category,
						"subCategory":selectedkey
				};
				oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, that.oHeader);
				oServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getParameter("success")) {
						var data = oEvent.getSource().getProperty("/subSubCategories");
						data = formatter.convertObjectToArray(data);
						oDropdownModel.setProperty("/subSubCategories", data);
					}
				});
				target = sap.ui.getCore().byId("VIEW_6");
				selectedPath=taxonomy+" > "+superDepartment+" > "+department+" > "+category+" > "+selectedText;
				oDashboardTabModel.setProperty(sPath+"/subCategory",selectedkey);
				skuTempObjectModel.setProperty("/choosePlacementTitle","Sub Sub Category");
			}
			if (sourceId === "VIEW_6") {
				selectedPath = taxonomy + " > " + superDepartment + " > " + department + " > " + category + " > " + subCategory + " > " +
				selectedText;
				oDashboardTabModel.setProperty(sPath+"/subSubCategory",selectedkey);
			}
			oDashboardTabModel.refresh();
			oDropdownModel.refresh();
			var navCon = sap.ui.getCore().byId("SF_NAV_CONTAINER");
			navCon.to(target, "flip");
			skuTempObjectModel.setProperty("/selectedPath", selectedPath);
			 skuTempObjectModel.refresh();
		},
		
		
		//Function to navigate back
		navBackPlacementViews: function() {
			var skuTempObjectModel=this.skuTempObjectModel;
			var oDashboardTabModel=this.oDashboardTabModel;
			var oDashboardVisibilityModel=this.oDashboardVisibilityModel;
			var sPath=skuTempObjectModel.getProperty("/placementPath");
			var taxonomy=oDashboardTabModel.getProperty(sPath+"/taxonomy");
			var superDepartment=oDashboardTabModel.getProperty(sPath+"/superDepartment");
			var department=oDashboardTabModel.getProperty(sPath+"/department");
			var category=oDashboardTabModel.getProperty(sPath+"/category");
			var subCategory=oDashboardTabModel.getProperty(sPath+"/subCategory");
			var subSubCategory=oDashboardTabModel.getProperty(sPath+"/subSubCategory");
			var navCon = sap.ui.getCore().byId("SF_NAV_CONTAINER");
			var currentPage=navCon.getCurrentPage().getId();
			var selectedPath;
			if (currentPage === "VIEW_2") {
				oDashboardVisibilityModel.setProperty("/storeFrontBackVisible",false);
			} else {
				oDashboardVisibilityModel.setProperty("/storeFrontBackVisible",true);
			}
			if (currentPage === "VIEW_2") {
				selectedPath="";
				skuTempObjectModel.setProperty("/choosePlacementTitle","Taxonomy");
			} else if (currentPage === "VIEW_3") {
				selectedPath=taxonomy+" > "+superDepartment;
				skuTempObjectModel.setProperty("/choosePlacementTitle","Super Department");
			} else if (currentPage === "VIEW_4") {
				selectedPath=taxonomy+" > "+superDepartment+" > "+department;
				skuTempObjectModel.setProperty("/choosePlacementTitle","Department");
			} else if (currentPage === "VIEW_5") {
				selectedPath=taxonomy+" > "+superDepartment+" > "+department+" > "+category;
				skuTempObjectModel.setProperty("/choosePlacementTitle","Category");
			} else if (currentPage === "VIEW_6") {
				selectedPath=taxonomy+" > "+superDepartment+" > "+department+" > "+category+" > "+subCategory;
				skuTempObjectModel.setProperty("/choosePlacementTitle","Sub Category");
			}
			skuTempObjectModel.setProperty("/selectedPath", selectedPath);
			skuTempObjectModel.setProperty("/taxonomy","");
			skuTempObjectModel.setProperty("/superDepartment","");
			skuTempObjectModel.setProperty("/department","");
			skuTempObjectModel.setProperty("/category","");
			skuTempObjectModel.setProperty("/subCategory","");
			skuTempObjectModel.setProperty("/subSubCategory","");
			oDashboardVisibilityModel.refresh();
			skuTempObjectModel.refresh();
			navCon.back();
		},
		
		onSelectPlacement: function() {
			var skuTempObjectModel = this.skuTempObjectModel;
			var oDashboardTabModel=this.oDashboardTabModel;
			var oDashboardVisibilityModel=this.oDashboardVisibilityModel;
			var sPath=skuTempObjectModel.getProperty("/placementPath");
			var placementIndex = sPath.split("/")[3];
			var selectedPath = skuTempObjectModel.getProperty("/selectedPath");
			var department = oDashboardTabModel.getProperty(sPath+"/department");
			var sPathIndex=parseInt(sPath.slice((sPath.length)-1));
			if (sPathIndex === 0) {
				oDashboardVisibilityModel.setProperty("/additionalPlacementAenabled",true);
				oDashboardTabModel.setProperty(sPath+"/placementType","primaryStorefront");
			} else if (sPathIndex === 1) {
				oDashboardVisibilityModel.setProperty("/additionalPlacementBenabled",true);
				oDashboardTabModel.setProperty(sPath+"/placementType","additionalPlacementA");
			} else if (sPathIndex === 2) {
				oDashboardVisibilityModel.setProperty("/additionalPlacementCenabled",true);
				oDashboardTabModel.setProperty(sPath+"/placementType","additionalPlacementB");
			} else if (sPathIndex === 3) {
				oDashboardVisibilityModel.setProperty("/additionalPlacementDenabled",true);
				oDashboardTabModel.setProperty(sPath+"/placementType","additionalPlacementC");
			}else if (sPathIndex === 4) {
				oDashboardTabModel.setProperty(sPath+"/placementType","additionalPlacementD");
			}
			oDashboardTabModel.setProperty(sPath + "/hierarchy", selectedPath);
			oDashboardVisibilityModel.refresh();
			oDashboardTabModel.refresh();
			if(department && placementIndex === "0"){
			dropdownServices.getProductTags(this,department);
			}
						
			this.oAttributeDialog.close();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<STORE_FRONT_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ATTCHMENT_TAG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to open attachment notes pop-up
		openAttachmentNotes: function(oEvent) {
			if (!this.oAttachmentNotes) {
				this.oAttachmentNotes = sap.ui.xmlfragment("freshdirect.SKU.fragments.attachmentNotes", this);
				this.getView().addDependent(this.oAttachmentNotes);
			}
			this.oAttachmentNotes.openBy(oEvent.getSource());
		},

		//Function to close attachment notes pop-up
		onCloseCommentBox: function() {
			this.oAttachmentNotes.close();
		},

		//Function to show confirmation for deleting attachment
		onDeleteAttachment: function(oEvent) {

			var that = this,
				MessageBox;
			if (!MessageBox) {
				MessageBox = jQuery.sap.require("sap.m.MessageBox");
			}
			var source = oEvent.getSource();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.confirm("Are you sure do you want to delete?", {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function(sAction) {
					if (sAction === "OK") {
						that.deleteSelectedAttachment(source);
					}
				}
			});
		},

		//Function to delete attachment
		deleteSelectedAttachment: function(source) {
			var oDashboardTableModel = this.oDashboardTableModel;
			var sPath = source.getParent().getBindingContext("oDashboardTableModel").getPath();
			var array = sPath.split("/");
			var len = array.length;
			var rowIndex = parseInt(array[len - 1]);
			oTableDataModel.getData().tableData.splice(rowIndex, 1);
			oTableDataModel.refresh();
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ATTCHMENT_TAG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<COMMENTS_TAG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//Function to post the comment
		onPostTabComment: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var requestId = oDashboardTabModel.getProperty("/requestId");
			var oComments = oDashboardTabModel.getProperty("/activityLogsDtos");
			var desc = oEvent.getSource().getValue();

			var oTempObj = {
				"date": new Date(),
				"description": desc,
				"group": "Merchant",
				"name": "",
				"systemGenerated": "No",
				"user": "Ravi",
				"requestId": requestId
			};
			oComments.unshift(oTempObj);
			oDashboardTabModel.refresh();
		},

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<COMMENTS_TAG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BINNING_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

		//Function To Set Binning Tab Layout Value On Load first Time
		setBinningTabLayoutData: function() {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var avgForcastVal = oDashboardTabModel.getProperty("/merchandisingDto/avgWeekUnitDemand");
			var binningData = oDashboardTabModel.getProperty("/binningDto");
			var unitPerCS = oDashboardTabModel.getProperty("/sourceInfoDtos/0/orderInfoDto/unitsPerCase");
			var casePerPAL = oDashboardTabModel.getProperty("/sourceInfoDtos/0/orderInfoDto/casesPerPallet");
			var minOrderQuan = oDashboardTabModel.getProperty("/sourceInfoDtos/0/orderInfoDto/minItemOrderQuantity");

			//Set value in binningDto
			oDashboardTabModel.setProperty("/binningDto/avgForecasteWeeklyVolume", avgForcastVal);
			oDashboardTabModel.setProperty("/binningDto/unitPerCase", unitPerCS);
			oDashboardTabModel.setProperty("/binningDto/casesPerPallet", casePerPAL);
			oDashboardTabModel.setProperty("/binningDto/minItemOrderQuantity", minOrderQuan);

			oDashboardVisibilityModel.setProperty("/binningVisibleMOQ", false);
			oDashboardVisibilityModel.refresh();
			oDashboardTabModel.refresh();
		},

		//Function To set Visibility of Minimumn Order Quantity SubItem
		onChangeBinningMinOrder: function(oEvent) {
			var oDashboardTabModel = this.oDashboardTabModel;
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			var oSelKey = oDashboardTabModel.getProperty("/binningDto/isMinimumOrderQty");
			if (oSelKey === "02") {
				oDashboardVisibilityModel.setProperty("/binningVisibleMOQ", true);
			} else {
				oDashboardVisibilityModel.setProperty("/binningVisibleMOQ", false);
			}
		},
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BINNING_TAB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<TASK_SERVICE_INTG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<NPC_TAB_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		onChangePublishedGDSN: function(oEvent){
			var selKey = oEvent.getSource().getSelectedKey();
			var oDashboardVisibilityModel = this.oDashboardVisibilityModel;
			if(selKey === "01"){
				oDashboardVisibilityModel.setProperty("/isNpcYesBoxVisible",true);
				oDashboardVisibilityModel.setProperty("/isNpcNoBoxVisible",false);
			}else if(selKey === "02"){
				oDashboardVisibilityModel.setProperty("/isNpcYesBoxVisible",false);
				oDashboardVisibilityModel.setProperty("/isNpcNoBoxVisible",true);
			}else{
				oDashboardVisibilityModel.setProperty("/isNpcYesBoxVisible",false);
				oDashboardVisibilityModel.setProperty("/isNpcNoBoxVisible",false);
			}
			oDashboardVisibilityModel.refresh();
		},
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<NPC_TAB_END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<TASK_FUNCTION_START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//Function to complete tab level tasks. Save_Mode = "Task"
		onCompleteTask: function(oEvent){
			this.busy.open();
			var taskId = oEvent.getSource().getCustomData()[0].getValue();
			//var taskName = this.getsTaskName(taskId);
			var isTaskAvailable = this.isTaskNameAvailable(taskId);
			var sUrl = "/sku/api/request/update";
			IdeationServices.onSaveSubmitCompleteSku(this, sUrl, taskId, "Task", "FEASIBILITY");
		},
		
		//Function to if there is already a task is available in taskDtos, else task service cannot be called
		isTaskNameAvailable: function(taskName){
			var isTaskAvailable = false;
			var oDashboardTabModel = this.oDashboardTabModel;
			var selectedSKU = oDashboardTabModel.getData();
			var bVal = selectedSKU.hasOwnProperty("taskDtos");
			if(bVal){
				var taskDtos = selectedSKU.taskDtos;
				taskDtos.filter(function(obj){
					if(taskName === obj.taskName){
						isTaskAvailable = true;
					}
				});
			}
			return isTaskAvailable;
		},
		
		//Function to get task names at every tab level
		getsTaskName: function(taskId){
			var taskName = "";
			switch(taskId){
				case "BASIC_ATTRIBUTE_TASK":  taskName = "Basic Product Attributes";
				break;
				case "WEIGHTS_AND_DIMS":  taskName = "WEIGHTS_AND_DIMS";
				break;
				case "MERCHANT_PRICING":  taskName = "Merchant Pricing";
				break;
				case "PRI_SOURCE_IDENTIFICATION":  taskName = "Primary Source Identification";
				break;
				case "COST_SHEET":  taskName = "Cost Sheet";
				break;
				case "ORDERING_INFO":  taskName = "Ordering Info";
				break;
				case "SALES_FORECAST":  taskName = "Sales Forecast";
				break;
				case "STORE_FRONT":  taskName = "Store Front";
				break;
				case "PRICING":  taskName = "Pricing";
				break;
				case "COST_SHEET_REVIEW":  taskName = "Cost Sheet Review";
				break;
				case "COST_SHEET_APPROVAL":  taskName = "Cost Sheet Approval";
				break;
				case "DMM":  taskName = "DMM";
				break;
				case "MERCHANT_NEGOTIATIONS":  taskName = "Merchant Negotiations";
				break;
				case "MERCHANT_COMMIT":  taskName = "Merchant Commit"; //Not added
				break;
				case "BINNING":  taskName = "Binning";
				break;
				case "MERCHANT_BINNING":  taskName = "Merchant Binning";
				break;
				case "NPC":  taskName = "NPC";
				break;
			}
			return taskName;
		}
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<TASK_SERVICE_INTG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<TASK_FUNCTION_END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
		
		
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf freshdirect.SKU.view.dashboard
		 */
		//	onBeforeRendering: function() {

		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf freshdirect.SKU.view.dashboard
		 */
		//	onAfterRendering: function() {

		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf freshdirect.SKU.view.dashboard
		 */
		//	onExit: function() {

		//	}
	});
});