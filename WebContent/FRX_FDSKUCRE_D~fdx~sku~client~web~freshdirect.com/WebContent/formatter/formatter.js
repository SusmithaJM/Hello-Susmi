jQuery.sap.declare("freshdirect.SKU.formatter.formatter");
freshdirect.SKU.formatter.formatter = {

	formatPanelVisibilty: function(oEvent) {
		var selectedDept, isChecked, oModel, sPath;
		if (typeof oEvent === "boolean") {
			isChecked = oEvent;
			selectedDept = this.getName();
			oModel = this.getModel("oModel");
			sPath = this.getBindingContext("oModel").getPath();
		} else {
			if (oEvent) {
				var oSource = oEvent.getSource();
				selectedDept = oSource.getName();
				isChecked = oSource.getSelected();
				oModel = oSource.getModel("oModel");
				sPath = oSource.getBindingContext("oModel").getPath();
			} else {
				return;
			}
		}
		sPath = sPath.split("/")[2];
		var subPanelData = oModel.getProperty("/data/" + sPath + "/subProductTagList");
		if (subPanelData) {
			subPanelData.filter(function(obj) {
				if (obj.tagId === selectedDept) {
					obj.isVisible = isChecked;
					oModel.refresh();
				}
			});
		}
		if (typeof oEvent === "boolean") {
			return isChecked;
		}
	},

	formatSAPProdDesc: function(brand, description, packageSize, individualPackageSizeUom, packageCount, packageType) {

		if ((packageSize !== "" && packageSize !== undefined) && (brand !== "" && brand !== undefined) && (description !==
				"" && description !== undefined) && (packageCount !== " " && packageCount !== undefined) && (packageType !== "" && packageType !==
				undefined) && (individualPackageSizeUom !== "" && individualPackageSizeUom !== undefined)) {

			var oIdeationVisiblityModel = this.oIdeationVisiblityModel;
			var sapProdDesc = brand + " " + description + "" + packageSize + individualPackageSizeUom + " " + packageCount + packageType;
			if (sapProdDesc.length > 40) {
				oIdeationVisiblityModel.setProperty("/sapProdDescValidVisiblity", false);
				oIdeationVisiblityModel.setProperty("/sapProdDescInvalidVisiblity", true);
			} else {
				oIdeationVisiblityModel.setProperty("/sapProdDescValidVisiblity", true);
				oIdeationVisiblityModel.setProperty("/sapProdDescInvalidVisiblity", false);
			}
			return sapProdDesc;
		}
	},
	
	formatCostPerCS: function(CostPerCs) {
		if (CostPerCs) {
			return CostPerCs;
		} else {
			return "";
		}
	},

	convertObjectToArray: function(obj) {
		if(obj === undefined){
			return [];
		}
		if (!Array.isArray(obj)) {
			return [obj];
		} else {
			return obj;
		}
	},

	formatBooleanVal: function(bVal) {
		if (bVal) {
			if(bVal === "true"||bVal===true){
				return true;
			}else if(bVal === "false"||bVal===false){
				return false;
			}
		}else{
			return false;
		}
	},

	formatBooleanVal1: function(bVal) {
		if (bVal) {
			if (bVal === "true" || bVal === true) {
				return true;
			} else if (bVal === "false" || bVal === false) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	},

	formatGTINValues: function(gtin) {
		var splitVal = gtin.split("");
		if (splitVal.length === 14) {
			var fistVal = splitVal[0];
			var secVal = splitVal[1] + splitVal[2];
			var thirdVal = splitVal[3] + splitVal[4] + splitVal[5] + splitVal[6] + splitVal[7];
			var fourthVal = splitVal[8] + splitVal[9] + splitVal[10] + splitVal[11] + splitVal[12];
			var fifthVal = splitVal[13];
			var formattedGTIN = fistVal + " " + secVal + " " + thirdVal + " " + fourthVal + " " + fifthVal;
			return formattedGTIN;
		}
	},

	formatSoleSourceVisibility: function(sourceInfoDto) {
		if (sourceInfoDto) {
			var length = sourceInfoDto.length;
			if (length === 1) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	},
    
	//Function To Format Boolean Value 
	formatBooleanValue: function(value) {
		if (value !== undefined && value !== "") {
			if (value === "true" || value === true) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
    
	//Function To Format Integer Value for Radio Button Group
	formatIntegerValue: function(int) {
		if (int !== undefined && int !== "") {
			int = parseInt(int);
			if(!isNaN(int)){
				return int;
			}else{
				return 0;
			}
		} else {
			return 0;
		}
	},
	
	//Function to Format Bracket Minimum and Maximum Value in CostSheet
	formatCaseRangeCount: function(min, max) {
		if(min !== undefined && min !== ""){
			var min = parseInt(min);
		}
		if(max !== undefined && max !== ""){
			var max = parseInt(max);
		}
		if ((min !== undefined && min !== "") && (max !== undefined && max !== "")) {
			min = parseFloat(min) + 1;
			var minmax = "(" + min + " - " + max + ")";
			return minmax;
		}

	},
    
	//Function to Format and Validate Bracket Minimum Value in CostSheet
	formatCaseRangeCountMin: function(min, max) {
		if(min !== undefined && min !== ""){
			var min = parseInt(min);
		}
		if(max !== undefined && max !== ""){
			var max = parseInt(max);
		}
		if ((min !== undefined && min !== "") && (max !== undefined && max !== "") && (min > max)) {
			sap.m.MessageToast.show("min value should be less than max ");
		} else if ((min !== undefined && min !== "") && (max !== undefined && max !== "")) {
			var minmax = "(" + min + " - " + max + ")";
			return minmax;
		}

	},

	grossPriceEA: function(grossPrice) {
		if (grossPrice !== undefined && grossPrice !== "") {
			var grossPriceEA = (grossPrice / 12).toFixed(2);
			return grossPriceEA;
		}
	},
	
	grossPriceEditable: function(bracket1) {
		if (bracket1 !== undefined && bracket1 !== "") {
			return true;
		} else {
			return false;
		}
	},
	
	bracket4Enabled: function(min, max) {
		if ((min !== undefined && min !== "") && (max !== undefined && max !== "")) {
			return true;
		} else {
			return false;
		}
	},
	
	bracketEnabled: function(bracket) {
		if ((bracket !== undefined && bracket !== "")) {
			return true;
		} else {
			return false;
		}
	},

	formatTotalNPC: function(totalNPC) {
		if (totalNPC !== undefined && totalNPC !== "") {
			totalNPC = "$ " + totalNPC;
			return totalNPC;
		}
	},
	
	formatScalingFactor: function(scalingFactor, totalNPC) {
		if (totalNPC !== undefined && totalNPC !== "" && scalingFactor !== undefined && scalingFactor !== "") {
			var cost = "$ " + (totalNPC / scalingFactor).toFixed(2);
			return cost;
		}
	},
	
	formatScalingFactor1: function(scalingFactor, totalNPC) {

		if (totalNPC !== undefined && totalNPC !== "" && scalingFactor !== undefined && scalingFactor !== "") {
			var each = "$ " + ((totalNPC / scalingFactor) / 12).toFixed(2);
			return each;
		}
	},

	comaSeparator: function(evt, costingUnit) {
		var value;
		if (evt !== undefined && evt !== "" && !isNaN(evt)) {
			if (evt === null) {
				return evt;
			} else {
				evt = parseFloat(evt);
				if (evt < 0) {
					evt = Math.abs(evt);
					evt = evt.toString();
					var parts = evt.split(".");
					var arrLen = parts.length;
					parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					if (arrLen === 1) {
						value = parts[0] + ".00";
						this.addStyleClass("oCardNeGDataClass");
						value = "(" + value + ")";
					} else {
						var strLen = parts[1].length;
						if (strLen === 1) {
							value = parts.join(".");
							this.addStyleClass("oCardNeGDataClass");
							value = "(" + value + "0" + ")";
						} else {
							value = parts.join(".");
							this.addStyleClass("oCardNeGDataClass");
							value = (parseFloat(value)).toFixed(2);
							value = "(" + value + ")";
						}
					}
					if (costingUnit === "%") {
						return value + " %";
					} else {
						return "$ " + value;
					}
				} else {
					evt = evt.toString();
					var parts = evt.split(".");
					var arrLen = parts.length;
					parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					if (arrLen === 1) {
						value = parts[0] + ".00";
						this.addStyleClass("oCardDataClass");
						value = value;
					} else {
						var strLen = parts[1].length;
						if (strLen === 1) {
							value = parts.join(".");
							this.addStyleClass("oCardDataClass");
							value = value + "0";
						} else {
							value = parts.join(".");
							this.addStyleClass("oCardDataClass");
							value = (parseFloat(value)).toFixed(2);
							value = value;
						}
					}
					if (costingUnit === "%") {
						return value + " %";
					} else {
						return "$ " + value;
					}
				}

			}
		}
	},

	isSystemGenerated: function(val) {
		if (val) {
			if (val == "Yes")
				return "sap-icon://action-settings";
			else
				return "sap-icon://account";;
		} else {
			return "sap-icon://account";;
		}
	},

	concatUserTeamName: function(team) {
		return "(" + team + ")";
	},

	//Format JAVA/UI Dates
	formatDateObject: function(date){
		
		if(date){
			var currDate = new Date(date);
			var dd = currDate.getDate();
			if(dd < 10){
				dd = dd.toString();
				dd = "0" + dd;
			}else{
				dd = dd.toString();
			}
			
			var mm = currDate.getMonth();
			mm = mm + 1;
			if(mm < 10){
				mm = mm.toString();
				mm = "0" + mm;
			}else{
				mm = mm.toString();
			}
			
			var yy = currDate.getFullYear();
			yy = yy.toString();
			
			var hrs = currDate.getHours();
			hrs = hrs.toString();
			
			var min = currDate.getMinutes();
			min = min.toString();
			
			var formattedDateTime = mm + "/" + dd + "/" + yy + " " + hrs + ":" + min;
			return formattedDateTime;
		}else{
			return "";
		}
	},
	
	//Function To set Visibility of Source Promote Button 
	formatSourceButtonVisibility: function(value){
		var buttonText = this.getText();
		if(value){
			if((value === "Primary")  && (buttonText === "Primary" || buttonText === "Secondary" || buttonText === "Other")){
			return false;
			}
			else if(value === "Secondary"){
				if(buttonText === "Primary" || buttonText === "Other"){
					return true;
				}else{
					return false;
				}
			} else {
				if(buttonText === "Primary" || buttonText === "Secondary"){
					return true;
				}else{
					return false;
				}
			}
		}else{
			return false;
		}
	},
	
	//Function to format and show page number.
	formatPageNumber: function(evt) {
		if (evt) {
			return "Page : " + evt;
		}
	},
	
	//Function to check for the phase of the sku and return image
	formatSKUPhase: function(value){
		if(value === "A"){
			return "images/slaInProgress.png";
		}else if(value === "G"){
			return "images/slaCompleted.png";
		}else if(value === "R"){
			return "images/pastSLA.png";
		}else if(value === "W"){
			return "images/slaNotStarted.png";
		}else{
			return "";
		}
	},
	
	//Function to set Reference GTINs of first row in dashboard table invisible
	setRefGTINInvisible: function(visible){
		if(visible === false){
			return false;
		}else{
			return true;
		}
	},
	
	//Function to add % symbol
	formatPercentSign : function(val){
		if(val){
			var val = val + " %";
			return val;
		}else{
			return "";
		}
	},
	
	//Function to add $ symbol
	formatDollarSign : function(val){
		if(val){
			var val = "$ "+val;
			return val;
		}else{
			return "";
		}
	},
	
	//Function to add Fahrenheit symbol
	formatFahrenheitValue : function(val){
		if(val){
			var val = val + " F";
			return val;
		}else{
			return "";
		}
	},
	
	//Function to convert DropDown Key to Value in dashboard table
	/*formatDropdownKey : function(val) {
		if(val === "01") {
			return "Yes";
		} else if(val === "02")	{
			return "No";
		} else {
			return "";
		}
	},*/
	formatDropdownKey : function(val) {
		if(val === true) {
			return "Yes";
		} else if(val === false)	{
			return "No";
		} else {
			return "Yes";
		}
	},
	
	//Function to check if MOQ applicable [Binning] in dashboard table
	isMOQApplicable: function(val,minOdrQuan) {
		if(minOdrQuan === "No")	{
		if(val === "01") {
			return "Yes";
		} else if(val === "02")	{
			return "No";
		} else {
			return "";
		}
		} else {
			return "";
		}
	},
	
	//Function to format Target Activation date for UI layer
	formatTargetActDateUI: function(date){
		if(date){
			return new Date(date);
		} else {
			return new Date();
		}
	},
	
	//Function to enable/disable target activation date if Target Date ASAP is checked
	enableTargetActivationDate: function(tarActDateEnabled, targetActivation){
		if(targetActivation){
			return tarActDateEnabled = false;
		} else {
			return tarActDateEnabled = true;
		}
	},
	
	//Function to format success and error messages icons
	formatSuccessErrorImage: function(bVal){
		if(bVal){
			return "images/validGTIN.png";
		} else {
			return "images/invalidGTIN.png";
	}
	},
	
	//Function To Check Equal Date
	checkTwoDatesIsEqual: function(oDate1, oDate2) {
		var dd1 = oDate1.getDate();
		var mm1 = oDate1.getMonth();
		var yy1 = oDate1.getFullYear();

		var dd2 = oDate2.getDate();
		var mm2 = oDate2.getMonth();
		var yy2 = oDate2.getFullYear();

		if (dd1 === dd2 && mm1 === mm2 && yy1 === yy2) {
			return true;
		} else {
			return false;
		}
	},
	
	//Function to return selected Billback on Accrual applicable text
	formatBillbackApplicableIndex: function(index){
		if(index === "1" || index === 1){
			return "Net of OIs, Scrap, B/H";
		}else {
			return "Gross";
		}
	},
	
	//Function to return selected OIs applicable text
	formatOIsIndex: function(index){
		if(index === "1" || index === 1){
			return "Extended Amount";
		}else {
			return "Unit Price";
		}
	},
	
	//Function to return selected Temp OI applicable text
	formatTempoiIndex: function(index){
		if(index === "1" || index === 1){
			return "Delivery Date";
		}else {
			return "Order Date";
		}
	},
	
	//Function to return selected Scrap Allowance applicable text
	formatScrapAllowanceIndex: function(index){
		if(index === "1" || index === 1){
			return "Net of OIs";
		}else {
			return "Gross";
		}
	}
};