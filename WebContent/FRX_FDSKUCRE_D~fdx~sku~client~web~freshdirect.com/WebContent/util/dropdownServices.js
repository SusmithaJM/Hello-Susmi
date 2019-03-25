jQuery.sap.declare("freshdirect.SKU.util.dropdownServices");
freshdirect.SKU.util.dropdownServices = {

	//Function to call all drop downs values [Both Gateway and Java]
	setDropdownData: function (dashboardCntlr) {
		this.oDataModel = dashboardCntlr.oDataModel;
		this.oDropdownModel = dashboardCntlr.oDropdownModel;
		this.oIconTabLayout = dashboardCntlr.getView().byId("iconTabId");
		this.oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		this.getMaterialType(dashboardCntlr);
	},

	//Function to get Material Types [Java Service]
	getMaterialType: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = this.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/materialtypes", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/materialTypes");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/materialType", data);
				that.getMfgList(dashboardCntlr);
				if(dashboardCntlr.oView.getViewName() !== "freshdirect.SKU.view.detailReport"){
				dashboardCntlr.loadIconTabLayFragments();
				}
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Manufacturers list [Java Service]
	getMfgList: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/dw/manufacturers", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/manufacturers");
				oDropdownModel.setProperty("/allManufacturerList", data);
				that.getProfitCenter(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Profit Center [Gateway Service]
	getProfitCenter: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/ProfitCenterSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/profitCenter", oData.results);
				that.getPurchasingGroup(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Purchasing Group [Gateway Service]
	getPurchasingGroup: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/PurchaseGrpSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/purchasingGroup", oData.results);
				that.getStorageTempRange(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Storage Temperature Range [Gateway Service]
	getStorageTempRange: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/TempCondSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/storageTempRange", oData.results);
				that.getPickMethod(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Pick Method [Gateway Service]
	getPickMethod: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/PickMethSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/pickMethod", oData.results);
				that.getPickDepartment(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Pick Department [Gateway Service]
	getPickDepartment: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/PickDeptSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/pickDepartment", oData.results);
				that.getStorageCondition(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Storage Condition [Gateway Service]
	getStorageCondition: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/StoreCondSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/storageCondition", oData.results);
				that.getCountryList(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Country [Gateway Service]
	getCountryList: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/CountrySet", {
			success: function (oData) {
				oDropdownModel.setProperty("/country", oData.results);
				that.getDimensionsUOMList(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},
	
	//Function to get Dimension UOM [Gateway Service]
	getDimensionsUOMList: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/DimensionsSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/dimensionUOM", oData.results);
				that.getNetContentUOMList(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},
	
	//Function to get Net content UOM [Gateway Service]
	getNetContentUOMList: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/NetWeiUomSet?$filter=ImDim eq 'VOLUME'", {
			success: function (oData) {
				oDropdownModel.setProperty("/NetContentUom", oData.results);
				that.getGrossWeightUOMList(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},
	
	//Function to get Gross Weight [Gateway Service]
	getGrossWeightUOMList: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/NetWeiUomSet?$filter=ImDim eq 'MASS'", {
			success: function (oData) {
				oDropdownModel.setProperty("/GrossWeightUom", oData.results);
				that.getBrandList(dashboardCntlr);
			},
			error: function (oData) {
				//Error msg;
			}
		});
	},

	//Function to get Brands list [Java Service]
	getBrandList: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/dw/brands", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/brands");
				oDropdownModel.setProperty("/allBrandList", data);
				that.getPackageType(dashboardCntlr);
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Package types [Java Service]
	getPackageType: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/packagetypes", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/packageTypes");
				oDropdownModel.setProperty("/packageTypeList", data);
				that.getPackageSizeUOM(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Package Size UOM [Java Service]
	getPackageSizeUOM: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/packagesizeuom", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/packageSizeUOMList");
				oDropdownModel.setProperty("/packageSizeUOMList", data);
				that.getTier1(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Tier1 [Java Service]
	getTier1: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/dw/tier1", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/tiers");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/tier1List", data);
				//that.getMerchantAttributes(dashboardCntlr);
				that.getStorageTempZone(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Attribute1 [Java Service]
	getMerchantAttributes: function (dashboardCntlr) {

		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oDashboardTabModel = that.oDashboardTabModel;
		var tier1value = oDashboardTabModel.getProperty("/ideationDto/tier1");
		var tier2value = oDashboardTabModel.getProperty("/ideationDto/tier2");
		var tier3value = oDashboardTabModel.getProperty("/ideationDto/tier3");

		var data = {
			"tier1": tier1value,
			"tier2": tier2value,
			"tier3": tier3value
		};

		var sUrl = "/sku/api/dw/attributes/";
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, JSON.stringify(data), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getData();
				data.attribute1 = freshdirect.SKU.formatter.formatter.convertObjectToArray(data.attribute1);
				data.attribute2 = freshdirect.SKU.formatter.formatter.convertObjectToArray(data.attribute2);
				data.attribute3 = freshdirect.SKU.formatter.formatter.convertObjectToArray(data.attribute3);
				data.attribute4 = freshdirect.SKU.formatter.formatter.convertObjectToArray(data.attribute4);
				oDropdownModel.setProperty("/attribute1", data.attribute1);
				oDropdownModel.setProperty("/attribute2", data.attribute2);
				oDropdownModel.setProperty("/attribute3", data.attribute3);
				oDropdownModel.setProperty("/attribute4", data.attribute4);
				//that.getStorageTempZone(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Storage Temp Zone [Java Service]
	getStorageTempZone: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/storagetempzones", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/storageTempZones");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/storageTempZone", data);
				that.getProductDating(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Product Dating [Java Service]
	getProductDating: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/productdatings", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/productDatings");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/productDating", data);
				that.getNutritionPanel(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Nutrition Panel [Java Service]
	getNutritionPanel: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/nutritionpanels", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/nutritionPanels");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/nutritionPanel", data);
				that.getFileType(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get File Type [Java Service]
	getFileType: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/filetypes", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/fileTypes");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/fileTypes", data);
				that.getSourceType(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Source Type [Java Service]
	getSourceType: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/sourcetypes", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/sourceTypes");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/sourceType", data);
				that.getorderUOM(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get order UOM [Java Service]
	getorderUOM: function (dashboardCntlr) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/orderuoms", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/orderUOMs");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/orderUOM", data);
				that.getIncClassification(dashboardCntlr);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function (oEvent) {
			//Error msg;
		});
	},

	//Function to get Incremental Classification[Java Service]
	getIncClassification : function(dashboardCntlr){
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/rules/incrementalityclassifications", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/incrementalityClassification");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/incrementalityClassification", data);
				that.getApplicableStateList();
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error msg;
		});
	},
	
	//Function to get Bottle Deposit [Java Service]
	getBottleDeposit: function(dashboardCntlr, applicableState) {
		var that = this;
		var skuTempObjectModel = dashboardCntlr.skuTempObjectModel;
		var oModel = new sap.ui.model.json.JSONModel();
		var oPayload={
				  "state":applicableState
		};
		oModel.loadData("/sku/api/rules/bottledeposits",  JSON.stringify(oPayload), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				skuTempObjectModel.setProperty("/bottleDeposits", data);
				dashboardCntlr.bottleDeposit();
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error msg;
		});
	},
	
	//Function to get State [Gateway Service]
	getStateList: function (dashboardCntlr, countryCode) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/StatesSet(Land1='" + countryCode + "')", {
			success: function (oData) {
				if(!Array.isArray(oData)){
					var oTempData = [];
					oTempData.push(oData);
					oData.results = oTempData;
				}
				oDropdownModel.setProperty("/state", oData.results);
			},
			error: function (oData) {

			}
		});
	},
	
	//Function to get Applicable State [Gateway Service]
	getApplicableStateList: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/StatesSet(Land1='US')", {
			success: function (oData) {
				if(!Array.isArray(oData)){
					var oTempData = [];
					oTempData.push(oData);
					oData.results = oTempData;
				}
				oDropdownModel.setProperty("/applicableStateList", oData.results);
			},
			error: function (oData) {

			}
		});
	},
	
	getSearchVendorNumber: function(oEvent, dashboardCntlr){
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		oDropdownModel.setProperty("/vendorNumberLookup","");
		var oVendorLookupModel = dashboardCntlr.oVendorLookupModel;
		
		var getInput = oEvent.getSource();
		var getVal = getInput.getValue();
		var digitCount = getVal.length;
		var oUrlParams = "$filter=substringof('" + getVal + "',Mcod1)";
		if(digitCount >= 3){
			oVendorLookupModel.read("/VendSearchSet", null, oUrlParams, true, function(oData){
				oDropdownModel.setProperty("/vendorNumberLookup", oData.results);
			});
		}
	},
	
	//Function to get Reference Material Number [Java Service]
	getRefMatNumber: function(dashboardCntlr,refMatNum ) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		var oPayload={
				"materialNo": refMatNum
		};
		oModel.loadData("/sku/api/dw/referencematerialsearch", JSON.stringify(oPayload), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/referenceMaterials");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/referenceMaterials", data);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error msg;
		});
	},
	
	//Function to get Websites [Java Service]
	getWebsites: function(dashboardCntlr,refMatNum ) {
		var that = this;
		var oDropdownModel = that.oDropdownModel;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/sku/api/dw/websites", "", true, "GET", false, false);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/estores");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/websites", data);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error msg;
		});
	},
	
	//Function to get Product Tags [Java Service]
	getProductTags: function(dashboardCntlr, department ) {
		var that = this;
		var oDashboardTabModel = that.oDashboardTabModel;
		var oModel = new sap.ui.model.json.JSONModel();
		var oPayload={
				"department": department
		};
		oModel.loadData("/sku/api/dw/tags",  JSON.stringify(oPayload), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/tags");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDashboardTabModel.setProperty("/storeFrontDto/storeFrontPlacementDtos/0/productTagsDtos", data);
			} else {
				//Error msg;
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error msg;
		});
	},
	
	
	//Function to getTier2 based on Tier1 on select of a SKU
	getTier2FromTier1: function(dashboardCntlr, tier1SelKey, tier2SelKey, tier3SelKey, tier4SelKey){
		
		var that = this;
		var oModel = new sap.ui.model.json.JSONModel();
		var oDropdownModel = dashboardCntlr.oDropdownModel;
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var oDashboardVisibilityModel = dashboardCntlr.oDashboardVisibilityModel;
		var oPayload = { "tier1" : tier1SelKey };
		var sUrl = "/sku/api/dw/tier2/";
		oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/tiers");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/tier2List", data);
				oDashboardTabModel.setProperty("/ideationDto/tier2", tier2SelKey);
				oDashboardVisibilityModel.setProperty("/isIdeationTier2Editable", true);
				that.getTier3FromTier2(dashboardCntlr, tier1SelKey, tier2SelKey, tier3SelKey, tier4SelKey);
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error Msg;
		});
	},
	
	//Function to getTier3 based on Tier2 on select of a SKU
	getTier3FromTier2: function(dashboardCntlr, tier1SelKey, tier2SelKey, tier3SelKey, tier4SelKey){
		
		var that = this;
		var oModel = new sap.ui.model.json.JSONModel();
		var oDropdownModel = dashboardCntlr.oDropdownModel;
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var oDashboardVisibilityModel = dashboardCntlr.oDashboardVisibilityModel;
		var oPayload = { "tier2" : tier2SelKey };
		var sUrl = "/sku/api/dw/tier3/";
		oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/tiers");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/tier3List", data);
				oDashboardTabModel.setProperty("/ideationDto/tier3", tier3SelKey);
				oDashboardVisibilityModel.setProperty("/isIdeationTier3Editable", true);
				that.getTier4FromTier1(dashboardCntlr, tier1SelKey, tier2SelKey, tier3SelKey, tier4SelKey);
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error Msg;
		});
	},
	
	//Function to getTier4 based on Tier3 on select of a SKU
	getTier4FromTier1: function(dashboardCntlr, tier1SelKey, tier2SelKey, tier3SelKey, tier4SelKey){
		
		var that = this;
		var oModel = new sap.ui.model.json.JSONModel();
		var oDropdownModel = dashboardCntlr.oDropdownModel;
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var oDashboardVisibilityModel = dashboardCntlr.oDashboardVisibilityModel;
		var oPayload = { "tier3" : tier3SelKey };
		var sUrl = "/sku/api/dw/tier4/";
		oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, dashboardCntlr.oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var data = oEvent.getSource().getProperty("/tiers");
				data = freshdirect.SKU.formatter.formatter.convertObjectToArray(data);
				oDropdownModel.setProperty("/tier4List", data);
				oDashboardVisibilityModel.setProperty("/isIdeationTier4Editable", true);
				oDashboardTabModel.setProperty("/ideationDto/tier4", tier4SelKey);
				oDashboardTabModel.refresh();
				that.getPaymentTerms(dashboardCntlr);
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			//Error Msg;
		});
	},
	
	//Function To Get Payment Terms DropDown Data
	getPaymentTerms: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/PaytermsSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/paymentTerm", oData.results);
				that.getIncoterms(dashboardCntlr);
			},
			error: function (oData) {

			}
		});
	},
	
	//Function To Get incoterms DropDown Data
	getIncoterms: function (dashboardCntlr) {
		var that = this;
		var oDataModel = that.oDataModel;
		var oDropdownModel = that.oDropdownModel;
		oDataModel.read("/IncotermsSet", {
			success: function (oData) {
				oDropdownModel.setProperty("/incoterms", oData.results);
			},
			error: function (oData) {

			}
		});
	}
};