jQuery.sap.declare("freshdirect.SKU.util.approvalService");
freshdirect.SKU.util.approvalService = {
		
	//Function to create new sku task
	onCreateSKUTask: function(dashboardCntlr){
	
		var that = dashboardCntlr;
		var oHeader = that.oHeader;
		var oDashboardTabModel = that.oDashboardTabModel;
		var requestId = oDashboardTabModel.getProperty("/requestId");
		var businessGroup = oDashboardTabModel.getProperty("");
		var purchaseGroup = oDashboardTabModel.getProperty("/ideationDto/purchasingGroup");
		var tier1 = oDashboardTabModel.getProperty("/ideationDto/tier1");
		var tier2 = oDashboardTabModel.getProperty("/ideationDto/tier2");
		
		var oPayload = {
			"requestId" : requestId,
			"businessGroup" : businessGroup,
			"purchaseGroup" : purchaseGroup,
			"tier1" : tier1,
			"tier2" : tier2
		};
		
		var sUrl = "sku/api/request/createtask";
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				
			} else {
				//Error msg;
			}
		});

		oModel.attachRequestFailed(function(oEvent) {
			//Error msg;
		});
	},
	
	//Function to update sku task
	onUpdateSKUTask: function(dashboardCntlr) {
	
		var that = dashboardCntlr;
		var oHeader = that.oHeader;
		var oDashboardTabModel = that.oDashboardTabModel;
		
		var oPayload = {
			"taskId" : "",
			"requestId" : "",
			"taskName" : "",
			"taskStatus" : "",
			"owners" : "",
			"startedOn" : "", 
			"completedOn" : "",
			"completedBy" : "",
			"isUpdated" : ""
		};
	
		var sUrl = "/sku/api/request/updatetask";
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, oHeader);
		oModel.attachRequestCompleted(function(oEvent){
			if (oEvent.getParameter("success")) {
				
			} else {
				//Error msg;
			}
		});

	oModel.attachRequestFailed(function(oEvent){
		//Error msg;
	});
}	
};