sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"freshdirect/SKU/formatter/formatter",
	"sap/m/BusyDialog",
	"freshdirect/SKU/util/util",
	"freshdirect/SKU/util/dropdownServices"
	], function(Controller, formatter, BusyDialog, util, dropdownServices){
	"use strict";

	return Controller.extend("freshdirect.SKU.controller.detailReport", {

	/**
	 * Called when a controller is in stantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf freshdirect.SKU.view.detailReport
	 */
	onInit: function() {
		var that = this;
		this.busy = new sap.m.BusyDialog();
		this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};
		var oDropdownModel = this.getOwnerComponent().getModel('oDropdownModel');
		this.oDropdownModel = oDropdownModel;
		
		var oDetailReportModel = this.getOwnerComponent().getModel('oDetailReportModel');
		this.oDetailReportModel = oDetailReportModel;
		
		var oDataModel = this.getOwnerComponent().getModel('oDataModel');
		this.oDataModel = oDataModel;
	
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.attachRoutePatternMatched(function(oEvent) {
			var viewName = oEvent.getParameter("name");
			if (viewName === "detailReport") {
				
				var filterBar = that.getView().byId("filterBar");
				filterBar._oFiltersButton.setVisible(false);
				filterBar._oHideShowButton.setType("Transparent").addStyleClass("sapUiSizeCompact");
				filterBar._oClearButtonOnFB.setType("Transparent").addStyleClass("sapUiSizeCompact");
				filterBar._oSearchButton.setText("Search").addStyleClass("sapUiSizeCompact").setWidth("4.5rem");
				filterBar._oClearButtonOnFB.setVisible(true);
				that.getView().byId("idVizFrame").setVisible(false);
				
				return new Promise(function(resolve, reject) {
					dropdownServices.setDropdownData(that);
				});
			}
		});
	},
	
	onSearch : function(oEvent){
		this.busy.open();
		var that = this;
		var oDetailReportModel = this.oDetailReportModel;
		var data = oDetailReportModel.getData();
		var oPayload = {
				"requestId" : data.requestId,
				"projectId" : data.projectId,
				"referenceGtin" : data.referenceGtin,
				"brand" : data.brand,
				"puchasingGroup" : data.puchasingGroup,
				"profitCenter" : data.profitCenter,
				"tier1" : data.tier1,
				"tier2" : data.tier2,
				"tier3" : data.tier3,
				"tier4" : data.tier4,
				"attribute1" : data.attribute1,
				"attribute2" : data.attribute2,
				"attribute3" : data.attribute3,
				"attribute4" : data.attribute4,
				"sapMaterial" : data.sapMaterial,
				"productId" : data.productId,
				"webId" : data.webId,
				"merchant" : data.merchant,
				"currentStage" : data.currentStage,
				"targetActivationDate" : data.targetActivationDate,
				"requestDate" : data.requestDate
		};
		var sUrl = "/sku/api/report/graph3";
		var oServiceModel = new sap.ui.model.json.JSONModel();
		oServiceModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, this.oHeader);
		oServiceModel.attachRequestCompleted(function(oEvent) {
			var resultData = oEvent.getSource().getData();
			oDetailReportModel.setProperty("/graph1Data",resultData.graph1Data);
			oDetailReportModel.refresh();
			that.getView().byId("idVizFrame").setVisible(true);
			that.busy.close();
		});
		
		oServiceModel.attachRequestFailed(function(oEvent) {
			that.busy.close();
			var errorText = "Internal Server Error"; //that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
			util.toastMessage(errorText);
		});
	},
	
	onClear : function(){
		var oDetailReportModel = this.oDetailReportModel;
		oDetailReportModel.setData({});
		oDetailReportModel.refresh();
		this.getView().byId("idVizFrame").setVisible(false);
	},
	
	onTier1Selection : function(oEvent){
		var oDetailReportModel = this.oDetailReportModel;
		var tier1 = oDetailReportModel.getProperty("/tier1");
		var tier2 = oDetailReportModel.getProperty("/tier2");
		var tier3 = oDetailReportModel.getProperty("/tier3");
		var tier4 = oDetailReportModel.getProperty("/tier4");
		oDetailReportModel.setProperty("/tier1", tier1);
		dropdownServices.getTier2FromTier1(this, tier1, tier2, tier3, tier4);
	},
	
	onSuggestBrand : function(oEvent){
		var that = this;
		util.onSuggestBrand(oEvent,that);
	},
	
	onSuggestAttribute1 : function(oEvent){
		var that = this;
		util.onSuggestAttribute1(oEvent,that);
	},
	onSuggestAttribute2 : function(oEvent){
		var that = this;
		util.onSuggestAttribute2(oEvent,that);
	},
	onSuggestAttribute3 : function(oEvent){
		var that = this;
		util.onSuggestAttribute3(oEvent,that);
	},
	onSuggestAttribute4 : function(oEvent){
		var that = this;
		util.onSuggestAttribute4(oEvent,that);
	}		
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
