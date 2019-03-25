jQuery.sap.declare("freshdirect.SKU.util.generateJWT");
freshdirect.SKU.util.generateJWT = {
		
	checkIsGTINExistinSAP: function(){
		
	},
	
	//Service to get GDSN service details
	getGDSNServiceDetails: function(skuData, dashboardCntlr, requestType){
		
		var that = this;
		this.dashboardCntlr = dashboardCntlr;
		var oGDSNDetailsModel = dashboardCntlr.oGDSNDetailsModel;
		var gdsnSUrl = oGDSNDetailsModel.getProperty("/serviceUrl");
		if(gdsnSUrl){
			var gdsnServiceDetails = oGDSNDetailsModel.getData();
			this.requestSessionToken(skuData, dashboardCntlr, gdsnServiceDetails, requestType);
		}else{
			var data = {
					"serviceUrl": "http://api-test.syncpdi.com/v1",
					"requestSession": "/auth/request-session-token",
					"gtinSearchService": "/gtin?gtin=",
					"gtinDataService": "/gtin/",
					"mapId": "236003",
					"apiClientId": "EQj5BNqbF7Gp7Wvc8BaC",
					"apiAuthKey": "6V9RuGunCGHVFfcwxfcfsmPQ2GWqk52b92wEhAY6LLRhK4CWzKS4SErGecxafg6W",
					"companyId": 2360,
					"sub": "Support",
					"alg": "HS256",
					"typ": "JWT"
				};
			
			oGDSNDetailsModel.setData(data);
			var gdsnServiceDetails = oGDSNDetailsModel.getData();
			this.requestSessionToken(skuData, dashboardCntlr, gdsnServiceDetails, requestType);
			/*var that = this;
			var oHeader = dashboardCntlr.oHeader;
			var sUrl = "";
			var oGDSNDetails = dashboardCntlr.oGDSNDetails;
			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, "", true, "GET", false, false, oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					var gdsnDetails = oEvent.getSource().getData();
					that.requestSessionToken(skuData, dashboardCntlr, gdsnServiceDetails);
				} else {
					dashboardCntlr.busy.close();
				}
			});
			oModel.attachRequestFailed(function(oEvent) {
				dashboardCntlr.busy.close();
			});*/
		}
	},

	//Service to request token from GDSN
	requestSessionToken: function(skuData, dashboardCntlr, gdsnDetails, requestType) {
		
		var that = this;
		var refGtin = skuData.ideationDto.referenceGtin;
		var jwt = this.generateSignedToken(gdsnDetails);
		var oModel = new sap.ui.model.json.JSONModel();
		var sRelativePath = gdsnDetails.serviceUrl;
		var requestSession = gdsnDetails.requestSession;
		
		var sUrl = sRelativePath + requestSession;
		var oHeaders = {
			"Accept": 'application/json',
			"Authorization": 'Bearer' + jwt
		};

		oModel.loadData(sUrl, "", true, "POST", false, false, oHeaders);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var sessionToken = oEvent.getSource().getData().data;
				that.searchGTIN(sessionToken, refGtin, dashboardCntlr, gdsnDetails, requestType);
			} else {
				dashboardCntlr.busy.close();
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			dashboardCntlr.busy.close();
		});
	},

	//Function to generate Jason Web Token
	generateSignedToken: function(gdsnDetails) {

		var oHeader = {
			"alg": 'HS256',
			"typ": 'JWT',
			"kid": gdsnDetails.apiClientId
		};
		var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(oHeader));
		var encodedHeader = this.base64url(stringifiedHeader);

		var oPayload = {
			"companyId": gdsnDetails.companyId,
			"sub": gdsnDetails.sub
		};
		var stringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(oPayload));
		var encodedPayload = this.base64url(stringifiedPayload);
		var token = encodedHeader + "." + encodedPayload;

		var secret = gdsnDetails.apiAuthKey;
		var signature = CryptoJS.HmacSHA256(token, secret);
		signature = this.base64url(signature);
		var signedToken = token + "." + signature;
		return signedToken;
	},

	//Function to convert base 64 string
	base64url: function(source) {
		var encodedSource = CryptoJS.enc.Base64.stringify(source); // Encode in classical base64
		encodedSource = encodedSource.replace(/=+$/, ''); // Remove padding equal characters
		encodedSource = encodedSource.replace(/\+/g, '-'); // Replace characters according to base64url specifications
		encodedSource = encodedSource.replace(/\//g, '_');
		return encodedSource;
	},

	//Service to search GTIN in GDSN
	searchGTIN: function(sessionToken, gtin, dashboardCntlr, gdsnDetails, requestType) {
		
		var that = this;
		var sRelativePath = gdsnDetails.serviceUrl;
		var searchGtin = gdsnDetails.gtinSearchService;
		var oModel = new sap.ui.model.json.JSONModel();
		var sUrl = sRelativePath + searchGtin + gtin;
		var oHeaders = {
			"Accept": 'application/json',
			"Authorization": 'Bearer' + sessionToken
		};

		oModel.loadData(sUrl, "", true, "GET", false, false, oHeaders);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var resultData = oEvent.getSource().getData();
				if(resultData.data[0]){
					var itemId = resultData.data[0].id;
					if(requestType === "VALIDATE_UPC" && itemId){
						freshdirect.SKU.util.util.toastMessage("UPC exists in GDSN");
						that.dashboardCntlr.busy.close();
						return;
					}else if(requestType === "SAVE"){

					}else if(requestType === "SUBMIT"){
						that.getLowPriceDistributors();
					}
				}else{
					dashboardCntlr.busy.close();
				}
			} else {
				dashboardCntlr.busy.close();
			}
		});
		oModel.attachRequestFailed(function(oEvent) {
			dashboardCntlr.busy.close();
		});
	},
	
	//Service to get lowest price distributors from SAP
	getLowPriceDistributors: function(){
		//In getting data from sap, call 
		//that.mergeGDSNwithSAPdata()
	},
	
	//Merge GDSN and SAP data for choosing hierarchies
	mergeGDSNwithSAPdata: function(dashboardCntlr){
		
		var that = this;
		var oHeader = dashboardCntlr.oHeader;
		var sUrl = "";
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, "", true, "GET", false, false, oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var resultData = oEvent.getSource().getData();
				that.openHierarchiesPopUp(resultData, dashboardCntlr);
			} else {

			}
			dashboardCntlr.busy.close();
		});
		oModel.attachRequestFailed(function(oEvent) {
			dashboardCntlr.busy.close();
		});

	},
	
	//Open Distributor Catalog pop-up
	openHierarchiesPopUp: function(resultData, dashboardCntlr){
		
		var oDashboardTabModel = dashboardCntlr.oDashboardTabModel;
		var brand = oDashboardTabModel.getProperty("/ideationDto/brand");
		var description = oDashboardTabModel.getProperty("/ideationDto/description");
		var packageSize = oDashboardTabModel.getProperty("/ideationDto/individualPackageSize");
		var individualPackageSizeUom = oDashboardTabModel.getProperty("/ideationDto/individualPackageSizeUom");
		var packageCount = oDashboardTabModel.getProperty("/ideationDto/packageCount");
		var packageType = oDashboardTabModel.getProperty("/ideationDto/packageType");
		var sapProdDesc = brand + " " + description + " " + packageSize + individualPackageSizeUom + " " + packageCount + packageType;
		
		var oData = resultData.data[0];
		var hierarchies = oData.hierarchies[0];
		var gtin = oData.gtin;

		var oIdeationHierachiesPopUp = dashboardCntlr.oIdeationHierachiesPopUp;
		oIdeationHierachiesPopUp.setProperty("/gtin", "0 03 00450 18404 7");
		oIdeationHierachiesPopUp.setProperty("/shortDescription", sapProdDesc);
		oIdeationHierachiesPopUp.setProperty("/hierarchies", hierarchies);
		oIdeationHierachiesPopUp.setProperty("/visibleRowCount", hierarchies.length);
		oIdeationHierachiesPopUp.refresh();
		
		dashboardCntlr.busy.close();
		dashboardCntlr.distributorCatalog.open();
	},	
	
	//On selecting a gtin congif, call a service to get GTIN data from GDSN
	getGTINDataFromGDSN: function(sessionToken, itemId, dashboardCntlr, gdsnDetails){
		
		var that = this;
		var mapId = gdsnDetails.mapId;
		var sRelativePath = gdsnDetails.serviceUrl;
		var getGtinData = gdsnDetails.gtinDataService;
		var oModel = new sap.ui.model.json.JSONModel();
		var sUrl = sRelativePath + getGtinData + itemId + "?mapId=" + mapId;
		var oHeaders = {
			"Accept": 'application/json',
			"Authorization": 'Bearer' + sessionToken
		};

		oModel.loadData(sUrl, "", true, "GET", false, false, oHeaders);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				var gdsnData = oEvent.getSource().getData();
				that.transposeGDSNdata(gdsnData, dashboardCntlr);
			} else {
				
			}
			dashboardCntlr.busy.close();
		});
		
		oModel.attachRequestFailed(function(oEvent) {
			dashboardCntlr.busy.close();
		});
	},
	
	//Service to Transpose GDSN data to UI consumable format, from JAVA
	transposeGDSNdata: function(gdsnData, dashboardCntlr){
		
		var that = this;
		var oHeader = dashboardCntlr.oHeader;
		var sUrl = "";
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData(sUrl, "", true, "GET", false, false, oHeader);
		oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				//Set data to dash board tab model
				//refresh data, show confirm pop-up,
			} else {

			}
			dashboardCntlr.busy.close();
		});
		oModel.attachRequestFailed(function(oEvent) {
			dashboardCntlr.busy.close();
		});
	}
};