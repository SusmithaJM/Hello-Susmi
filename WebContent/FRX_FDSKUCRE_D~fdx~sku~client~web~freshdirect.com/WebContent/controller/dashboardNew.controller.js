sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"freshdirect/SKU/formatter/formatter",
	"freshdirect/SKU/util/util",
	"freshdirect/SKU/util/jsrsasign",
	"freshdirect/SKU/util/generateJWT",
	"sap/ui/model/json/JSONModel",
	"sap/m/BusyDialog"
], function(Controller, formatter, util, CryptoJS, generateJWT, JSONModel, BusyDialog) {
	"use strict";

	return Controller.extend("freshdirect.SKU.controller.dashboardNew", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf freshdirect.SKU.view.dashboard
		 */
		onInit: function() {

			var that = this;
			this.busy = new BusyDialog();
			this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};
			this._router = sap.ui.core.UIComponent.getRouterFor(this);

			var navigationModel = new sap.ui.model.json.JSONModel();
			navigationModel.loadData("model/navigationData.json", "", true, "GET", false, false);
			this.getView().setModel(navigationModel, "navigationModel");

			this._router.attachRoutePatternMatched(function(oEvent) {
				var viewName = oEvent.getParameter("name");
				if (viewName === "dashboardNew") {
					that.routePatternMatched(oEvent);
					that.loadIdeationModel();
					that.onAttachmentLoad();
					that.loadDashboardData();

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.loadData("model/productTag.json", "", true, "GET", false, false);
					that.getView().setModel(oModel, "oModel");

					var newDashboardModel = new sap.ui.model.json.JSONModel();
					newDashboardModel.loadData("model/newData.json", "", true, "GET", false, false);
					that.getView().setModel(newDashboardModel, "newDashboardModel");

					//that.generatePanel();
					that.getService();
				}
			});
		},

		getService: function() {

			var oModel = new sap.ui.model.json.JSONModel();

			var sUrl = "/SKU/rest/rules/getMaterialFields/HAVA";

			oModel.loadData(sUrl, null, true, "GET", false, false, this.oHeader);
			oModel.attachRequestCompleted(function(oEvent) {
				var message = oEvent.getSource().getData().message;
			});
			oModel.attachRequestFailed();
		},

		routePatternMatched: function(oEvent) {
			var oDashboardTableModel = this.getOwnerComponent().getModel('oDashboardTableModel');
			this.oDashboardTableModel = oDashboardTableModel;

			var oResourceModel = this.getOwnerComponent().getModel('i18n');
			this.oResourceModel = oResourceModel.getResourceBundle();

			var oDashboardVisibilityModel = this.getOwnerComponent().getModel('oDashboardVisibilityModel');
			this.oDashboardVisibilityModel = oDashboardVisibilityModel;

			var columnVisibleModel = this.getOwnerComponent().getModel('columnVisibleModel');
			this.columnVisibleModel = columnVisibleModel;

			var oIdeationModel = this.getOwnerComponent().getModel('oIdeationModel');
			this.getView().setModel(oIdeationModel, "oIdeationModel");
			this.oIdeationModel = oIdeationModel;

			var oIdeationDropdownModel = this.getOwnerComponent().getModel('oIdeationDropdownModel');
			this.getView().setModel(oIdeationDropdownModel, "oIdeationDropdownModel");
			this.oIdeationDropdownModel = oIdeationDropdownModel;

			var oIdeationVisiblityModel = this.getOwnerComponent().getModel('oIdeationVisiblityModel');
			this.getView().setModel(oIdeationVisiblityModel, "oIdeationVisiblityModel");
			this.oIdeationVisiblityModel = oIdeationVisiblityModel;

			var oIdeationServiceModel = this.getOwnerComponent().getModel('oIdeationServiceModel');
			this.getView().setModel(oIdeationServiceModel, "oIdeationServiceModel");
			this.oIdeationServiceModel = oIdeationServiceModel;
		},

		loadDashboardData: function() {
			var that = this;
			var sUrl = "/SKU/rest/skuRequest/getAllSKURequest/2";
			that.oDashboardTableModel.loadData(sUrl, null, true, "GET", false, false, that.oHeader);
			that.oDashboardTableModel.attachRequestCompleted(function(oEvent) {
				that.oDashboardVisibilityModel.setProperty("/createRefernceEnable", false);
				that.oDashboardVisibilityModel.setProperty("/ideationVisible", true);
				that.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				that.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				that.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				that.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				that.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				that.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				that.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				that.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				that.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				that.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				that.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				that.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				that.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				that.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				that.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
				that.oDashboardVisibilityModel.setProperty("/UPCInvalidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCValidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCNewVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCGDSNVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCEachInvalidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCEachValidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCInnerInvalidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCInnerValidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCCaseInvalidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/UPCCaseValidVisiblity", false);
				that.oDashboardVisibilityModel.setProperty("/sapProdDescEditEnabled", false);
			});
			that.oDashboardTableModel.attachRequestFailed(function(oEvent) {

			});
		},
		onRowSelection: function(oEvent) {
			var selectedRow = oEvent.getSource().getSelectedIndex();
			var that = this;
			if (selectedRow != -1) {
				that.oDashboardModel.setProperty("/createRefernceEnable", true);
			} else {
				that.oDashboardModel.setProperty("/createRefernceEnable", false);
			}
		},

		/* Start Product Tags Tab */
		generatePanel: function() {
			var that = this;
			var oVbox = this.getView().byId("SKU_PRODUCT_TAGS_VBOX");
			oVbox.bindAggregation("items", "oModel>/data", function(index, context) {
				var oGridLayout = new sap.ui.layout.Grid({
					defaultSpan: "L2 M6 S10",
					class: "sapUiSmallMarginTop"
				});
				oGridLayout.bindAggregation("content", "oModel>tagsList", function() {
					return new sap.m.CheckBox({
						text: "{oModel>tagName}",
						name: "{oModel>tagId}",
						selected: {
							path: "oModel>isChecked",
							formatter: formatter.formatPanelVisibilty
						},
						select: function(oEvent) {
							formatter.formatPanelVisibilty(oEvent);
						}
					});
				});

				var vbox = new sap.m.VBox();
				vbox.bindAggregation("items", "oModel>subProductTagList", function(index, context) {
					var oPanel = new sap.m.Panel({
						width: "auto",
						expandable: true,
						class: "sapUiResponsiveMargin",
						accessibleRole: "Region",
						headerText: "{oModel>productTagName}",
						visible: "{oModel>isVisible}"
					});

					oPanel.bindAggregation("content", "oModel>productTagList", function(index, context) {
						var oSubGridLayout = new sap.ui.layout.Grid({
							defaultSpan: "L2 M6 S10",
							class: "sapUiSmallMarginTop"
						});
						oSubGridLayout.bindAggregation("content", "oModel>subProductList", function(index, context) {
							return new sap.m.CheckBox({
								text: "{oModel>tagName}",
								selected: "{oModel>isChecked}"
							});
						});
						var oSubPanel = new sap.m.Panel({
							width: "80%",
							class: "sapUiResponsiveMargin",
							accessibleRole: "Form",
							headerText: "{oModel>subProductTagName}",
							expandable: false,
							content: oSubGridLayout
						});
						return oSubPanel;
					});
					return oPanel;
				});

				var oPanel = new sap.m.Panel({
					width: "auto",
					class: "sapUiResponsiveMargin",
					accessibleRole: "Region",
					headerText: "{oModel>productTagName}",
					expandable: true,
					content: [oGridLayout, vbox]
				});
				return oPanel;
			});
		},
		/* End Product Tags Tab */

		/* Start Comments Tab */
		onAttachmentLoad: function() {
			var oData = [{
				"Author": "Alexandrina Victoria",
				"Date": "March 03 2013",
				"Text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
			}, {
				"Author": "George Washington",
				"Date": "March 04 2013",
				"Text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore"
			}, {
				"Author": "Alexandrina Victoria",
				"Date": "March 05 2013",
				"Text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat"
			}, {
				"Author": "George Washington",
				"Date": "March 07 2013",
				"Text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
			}];

			var oAttachmentModel = new sap.ui.model.json.JSONModel();
			oAttachmentModel.setProperty("/data", oData);
			this.getView().setModel(oAttachmentModel, "oAttachmentModel");
		},

		onPost: function(oEvent) {
			var oFormat = DateFormat.getDateTimeInstance({
				style: "medium"
			});
			var oDate = new Date();
			var sDate = oFormat.format(oDate);
			//		create new entry
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				Author: "Ravikiran",
				Date: "" + sDate,
				Text: sValue
			};

			//		update model
			var oAttachmentModel = this.getView().getModel("oAttachmentModel");
			var aEntries = oAttachmentModel.getData().data;
			aEntries.unshift(oEntry);
			oAttachmentModel.setData({
				data: aEntries
			});
		},
		/* End Comments Tab */

		/* Start Navigation Icons and Drop down Functionality */
		onNavItem1: function(oEvent) {
			var iconPressed = oEvent.getSource().getIcon();
			var navigationModel = this.getView().getModel("navigationModel");
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
			var navigationModel = this.getView().getModel("navigationModel");
			var navigationModelData = navigationModel.getData();
			var selectKey = parseInt(navigationModel.getProperty("/selectKey"));
			var maxKeyLength = navigationModelData.iconTab.length;
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
			if (selectKey === 1) {
				this.getView().byId("iconTabId").setSelectedKey("01");
			} else if (selectKey === 2) {
				this.getView().byId("iconTabId").setSelectedKey("02");
			} else if (selectKey === 3) {
				this.getView().byId("iconTabId").setSelectedKey("03");
			} else if (selectKey === 4 || selectKey === 5 || selectKey === 6 || selectKey === 7 || selectKey === 8 || selectKey === 9) {
				this.getView().byId("iconTabId").setSelectedKey("04");
			} else if (selectKey === 10) {
				this.getView().byId("iconTabId").setSelectedKey("06");
			} else if (selectKey === 11) {
				this.getView().byId("iconTabId").setSelectedKey("05");
			} else if (selectKey === 12) {
				this.getView().byId("iconTabId").setSelectedKey("07");
			} else if (selectKey === 13) {
				this.getView().byId("iconTabId").setSelectedKey("08");
			} else if (selectKey === 14) {
				this.getView().byId("iconTabId").setSelectedKey("09");
			} else if (selectKey === 15) {
				this.getView().byId("iconTabId").setSelectedKey("10");
			} else if (selectKey === 16) {
				this.getView().byId("iconTabId").setSelectedKey("11");
			}
		},
		onDropDownSelect: function(selectKey) {
			if (selectKey === 1) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", true);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 2) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", true);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 3) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", true);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 4) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", true);
				this.oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey == 5) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", true);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 6) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", true);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 7) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", true);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 8) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", true);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 9) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", true);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 10) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", true);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 11) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", true);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 12) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", true);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 13) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", true);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 14) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", true);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 15) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", true);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", false);
			} else if (selectKey === 16) {
				this.oDashboardVisibilityModel.setProperty("/ideationVisible", false);
				this.oDashboardVisibilityModel.setProperty("/basicAttrVisible", false);
				this.oDashboardVisibilityModel.setProperty("/binningVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourcePrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightDimsPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/sourceInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/weightsDimsSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/orderingInfoSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetPrimaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/costSheetSecondaryVisible", false);
				this.oDashboardVisibilityModel.setProperty("/productTagsVisible", false);
				this.oDashboardVisibilityModel.setProperty("/cfmVisible", false);
				this.oDashboardVisibilityModel.setProperty("/merchandizingVisible", false);
				this.oDashboardVisibilityModel.setProperty("/DMMVisible", false);
				this.oDashboardVisibilityModel.setProperty("/storefrontVisible", false);
				this.oDashboardVisibilityModel.setProperty("/attachmentVisible", false);
				this.oDashboardVisibilityModel.setProperty("/commentsVisible", true);
			}
		},
		/* End Navigation Icons and Drop down Functionality */

		/* Start Tab bar selection change on Dashboard table */
		/*onIconBarSelect : function(oEvent) {
			var selectedKey = parseInt(oEvent.getSource().getSelectedKey());
			var navigationModel = this.getView().getModel("navigationModel");
			navigationModel.setProperty("/selectKey",selectedKey);
			this.onDropDownSelect(selectedKey);
		},*/
		/* End Tab bar selection change on Dashboard table */

		/* Start Title bar buttons functionality */
		onDropdownClick: function(oEvent) {
			var that = this;
			var oButtonText = oEvent.getSource().getText();
			if (oButtonText === "Create") {
				that.oDashboardModel.setProperty("/createVisible", true);
				that.oDashboardModel.setProperty("/modifyVisible", false);
				that.oDashboardModel.setProperty("/uploadVisible", false);
				that.oDashboardModel.setProperty("/templateVisible", false);
			} else if (oButtonText === "Modify") {
				that.oDashboardModel.setProperty("/createVisible", false);
				that.oDashboardModel.setProperty("/modifyVisible", true);
				that.oDashboardModel.setProperty("/uploadVisible", false);
				that.oDashboardModel.setProperty("/templateVisible", false);
			} else if (oButtonText === "Upload") {
				that.oDashboardModel.setProperty("/createVisible", false);
				that.oDashboardModel.setProperty("/modifyVisible", false);
				that.oDashboardModel.setProperty("/uploadVisible", true);
				that.oDashboardModel.setProperty("/templateVisible", false);
			} else if (oButtonText === "Templates") {
				that.oDashboardModel.setProperty("/createVisible", false);
				that.oDashboardModel.setProperty("/modifyVisible", false);
				that.oDashboardModel.setProperty("/uploadVisible", false);
				that.oDashboardModel.setProperty("/templateVisible", true);
			}
			if (!this.dropdownDialog) {
				this.dropdownDialog = sap.ui.xmlfragment("freshdirect.SKU.fragments.dashboardDropdown", this);
				this.getView().addDependent(this.dropdownDialog);
			}
			this.dropdownDialog.openBy(oEvent.getSource());
		},
		/* End Title bar buttons functionality */

		/* Create SKU */
		onCreateNewSKU: function(oEvent) {
			this.getView().byId("iconTabId").setSelectedKey("01");
		},

		/*********************** Susmitha ****************/
		/*IDEATION CODE STARTS*/

		onFdSellableCheckBoxSelect: function(oEvent) {
			var selectedBox = oEvent.getSource().getText();
			var eachSelected = oEvent.getSource().getModel("oIdeationModel").getData().isEachChecked;
			var innerSelected = oEvent.getSource().getModel("oIdeationModel").getData().isInnerChecked;
			if (selectedBox == "Each" && innerSelected == true) {
				oEvent.getSource().setSelected(false);
				util.toastMessage("You cannot select Each with Inner");
			}
			if (selectedBox == "Inner" && eachSelected == true) {
				oEvent.getSource().setSelected(false);
				util.toastMessage("You cannot select Inner with Each");
			}
		},
		loadIdeationModel: function() {
			var oIdeationDropdownModel = this.oIdeationDropdownModel;
			oIdeationDropdownModel.loadData("model/SKUModel.json");
			this.ideationTabRefresh();
		},

		//	Below function performs check digit validation [JAVA service]
		/*GET Service to Check whether UPC is Valid or not*/
		checkUPCValidity: function() {

			var that = this;
			var oIdeationModel = this.oIdeationModel;
			var oIdeationServiceModel = this.oIdeationServiceModel;
			var oIdeationVisiblityModel = this.oIdeationVisiblityModel;
			var oResourceModel = this.oResourceModel;

			//var UPCCheckboxState = oIdeationModel.getProperty("/UPCCheckboxState");
			var validUPCMessage = oResourceModel.getProperty("/VALID_UPC");
			var invalidUPCMessage = oResourceModel.getProperty("/INVALID_UPC");

			var upc = oIdeationModel.getProperty("/upc");
			var sUrl = "/SKU/rest/skuRequest/upcValidation/" + upc;

			oIdeationServiceModel.loadData(sUrl, null, true, "GET", false, false, that.oHeader);
			oIdeationServiceModel.attachRequestCompleted(function(oEvent) {
				var message = oEvent.getSource().getData().message;
				if (message === "INVALID_UPC") {
					oIdeationVisiblityModel.setProperty("/UPCInvalidVisiblity", true);
					oIdeationVisiblityModel.setProperty("/UPCValidVisiblity", false);
					util.toastMessage(invalidUPCMessage);
				} else if (message === "VALID_UPC") {
					oIdeationVisiblityModel.setProperty("/UPCInvalidVisiblity", false);
					oIdeationVisiblityModel.setProperty("/UPCValidVisiblity", true);
					util.toastMessage(validUPCMessage);
				} else {
					oIdeationVisiblityModel.setProperty("/UPCInvalidVisiblity", false);
					oIdeationVisiblityModel.setProperty("/UPCValidVisiblity", false);
				}
				oIdeationVisiblityModel.rerfesh();
			});

			oIdeationServiceModel.attachRequestFailed(function(oEvent) {
				// that.busy.close();
			});
		},

		/*Function opens the pop-up to add new Brand*/
		openAddBrandPopup: function(oEvent) {
			var oIdeationModel = this.oIdeationModel;
			this.addBrandPopover = sap.ui.xmlfragment("freshdirect.SKU.fragments.addBrand", this);
			this.getView().addDependent(this.addBrandPopover);
			oIdeationModel.setProperty("/newBrand", "");
			this.addBrandPopover.openBy(oEvent.getSource());
		},

		//	Below function closes the Brand pop-up
		onRejectNewBrand: function() {
			this.addBrandPopover.close();
		},

		/*Function to add new Brand to Existing Brands*/
		onAddNewBrand: function() {
			var oIdeationModel = this.oIdeationModel;
			var oIdeationDropdownModel = this.oIdeationDropdownModel;
			var brand = oIdeationDropdownModel.getProperty("/brand");
			var newBrand = oIdeationModel.getProperty("/newBrand");
			var obj = {
				"b": newBrand,
				"key": newBrand
			};
			brand.unshift(obj);
			oIdeationModel.setProperty("/brand", newBrand);
			oIdeationDropdownModel.refresh();
			oIdeationModel.refresh();
			this.addBrandPopover.close();
		},

		//	UPCCheckboxSelected: function(oEvent) {
		//	var oIdeationModel = this.getView().getModel("oIdeationModel");
		//	var UPCCheckboxState = oEvent.getParameters().getSelected();
		//	oIdeationModel.setProperty("/targetActivation",	UPCCheckboxState);
		//	this.UPCvalid();
		//	},

		/*Function to enable SAP Product Description TextArea*/
		onSAPProdDescEdit: function() {
			var oIdeationVisiblityModel = this.oIdeationVisiblityModel;
			oIdeationVisiblityModel.setProperty("/sapProdDescEditEnabled", true);
		},

		/*Function gives Target ASAP date when Target ASAP checkbox is checked*/
		targetActitivationDate: function() {
			//var oIdeationModel = this.oIdeationModel;
			var today = new Date();
			var modDate = today.setDate(today.getDate() + 13);
			var finaldate = new Date(modDate);
			return finaldate;
			//oIdeationModel.setProperty("/finalDate", finaldate);
		},

		/*Function sets the Target Activation Date when Target ASAP is checked*/
		onTarActASAP: function(oEvent) {
			var oIdeationModel = this.oIdeationModel;
			var oIdeationVisiblityModel = this.oIdeationVisiblityModel;
			var finalDate = this.targetActitivationDate();
			var checkboxState = oEvent.getSource().getSelected();
			//var finalDate = oIdeationModel.getProperty("/finalDate");

			var dd = finalDate.getDate();
			var mm = finalDate.getMonth() + 1;
			if (mm < 10) {
				mm = "0" + mm;
			}
			var yy = finalDate.getFullYear();
			var date = dd + "/" + mm + "/" + yy;
			if (checkboxState === true) {

				oIdeationModel.setProperty("/targetActivationDate", date);
				oIdeationVisiblityModel.setProperty("/tarActDateenabled", false);
			} else {
				oIdeationModel.setProperty("/targetActivationDate", "");
				oIdeationVisiblityModel.setProperty("/tarActDateEnabled", true);
			}
			oIdeationVisiblityModel.refresh();
		},

		/*Function is triggered when Target Activation date is selected Manually*/
		onTargetActivationDateChange: function(oEvent) {
			this.targetActitivationDate();
			var selectedDate = oEvent.getSource().getDateValue();
			var oIdeationModel = this.oIdeationModel;
			var oResourceModel = this.oResourceModel;
			var finalDate = oIdeationModel.getProperty("/finalDate");
			if (finalDate >= selectedDate) {
				var errorMessage = oResourceModel.getProperty("/TARGET_ACTIVATION_ERROR");
				util.toastMessage(errorMessage);
				oIdeationModel.setProperty("/tarActDate", "");
			}
		},

		/*Function to set the dropdown values for Tier2 based on Tier1 value Selected*/
		onTier1Selection: function(oEvent) {

			var oIdeationModel = this.oIdeationModel;
			var oIdeationDropdownModel = this.oIdeationDropdownModel;
			var selectedkey = oEvent.getSource().getSelectedKey();
			var tier2 = oIdeationDropdownModel.getProperty("/tier2");
			var temp1 = [];
			for (var i = 0; i < tier2.length; i++) {
				if (selectedkey === tier2[i].key) {
					temp1.push(tier2[i].value);
				}
			}

			oIdeationDropdownModel.setProperty("/tier2array", temp1);
			oIdeationModel.setProperty("/tier2", "");
			oIdeationModel.setProperty("/tier3", "");
			oIdeationModel.setProperty("/tier4", "");
		},

		/*Function to set the dropdown values for Tier3 based on Tier2 value Selected*/
		onTier2Selection: function(oEvent) {
			var oIdeationModel = this.oIdeationModel;
			var oIdeationDropdownModel = this.oIdeationDropdownModel;
			var selectedkey = oEvent.getSource().getSelectedKey();
			var tier3 = oIdeationDropdownModel.getProperty("/tier3");
			var temp2 = [];
			for (var i = 0; i < tier3.length; i++) {
				if (tier3[i].key === selectedkey) {
					temp2.push(tier3[i].value);
				}
			}
			oIdeationDropdownModel.setProperty("/tier3array", temp2);
			oIdeationModel.setProperty("/tier3", "");
			oIdeationModel.setProperty("/tier4", "");
		},

		/*Function to set the dropdown values for Tier4 based on Tier3 value Selected*/
		onTier3Selection: function(oEvent) {
			var oIdeationModel = this.oIdeationModel;
			var oIdeationDropdownModel = this.oIdeationDropdownModel;
			var tier4 = oIdeationDropdownModel.getProperty("/tier4");
			var selectedkey3 = oEvent.getSource().getSelectedKey();
			var temp3 = [];
			for (var i = 0; i < tier4.length; i++) {
				if (tier4[i].key === selectedkey3) {
					temp3.push(tier4[i].value);
				}
			}
			oIdeationDropdownModel.setProperty("/tier4array", temp3);
			oIdeationModel.setProperty("/tier4", "");
		},

		/*POST services to Create new SKU [JAVA service]*/
		onSubmit: function() {
			var that = this;
			var oIdeationServiceModel = this.oIdeationServiceModel;
			var oIdeationModel = this.oIdeationModel;
			var oResourceModel = this.oResourceModel;
			var SKUData = oIdeationModel.getProperty("/");
			if ((SKUData.targetActivationDate !== "" && SKUData.targetActivationDate !== undefined) &&
				(SKUData.brand !== "" && SKUData.brand !== undefined) &&
				(SKUData.materialType !== "" && SKUData.materialType !== undefined) &&
				(SKUData.upc !== "" && SKUData.upc !== undefined) &&
				(SKUData.storeTemperatureZone !== "" && SKUData.storeTemperatureZone !== undefined) &&
				(SKUData.tier1 !== "" && SKUData.tier1 !== undefined) &&
				(SKUData.tier2 !== "" && SKUData.tier2 !== undefined) &&
				(SKUData.tier3 !== "" && SKUData.tier3 !== undefined) &&
				(SKUData.tier4 !== "" && SKUData.tier4 !== undefined) &&
				(SKUData.attribute1 !== " " && SKUData.attribute1 !== undefined) &&
				(SKUData.attribute2 !== " " && SKUData.attribute2 !== undefined) &&
				(SKUData.attribute3 !== " " && SKUData.attribute3 !== undefined) &&
				(SKUData.attribute4 !== " " && SKUData.attribute4 !== undefined)) {

				var sUrl = "/SKU/rest/skuRequest/createRequest";
				var successMessage = oResourceModel.getProperty("/SKU_CREATION_SUCCESS");
				var errorMessage = oResourceModel.getProperty("/SKU_CREATION_ERROR");
				var oIdeationModelData = oIdeationModel.getProperty("/");
				this.busy.open();
				oIdeationServiceModel.loadData(sUrl, JSON.stringify(oIdeationModelData), true, "POST", false, false, that.oHeader);

				oIdeationServiceModel.attachRequestCompleted(function(oEvent) {
					if (oEvent.getSource().getData().status === "true") {
						util.toastMessage(successMessage);
						that.ideationTabRefresh();
					} else {
						util.toastMessage(successMessage);
					}
					that.busy.close();
				});

				oIdeationServiceModel.attachRequestFailed(function(oEvent) {
					that.busy.close();
				});

			} else {
				var errorMessage = oResourceModel.getProperty("/FILL_MANDATORY_FIELDS");
				util.toastMessage(errorMessage);

			}
		},

		/*Refresh the Ideation Page*/
		onCancel: function(oEvent) {
			this.ideationTabRefresh();
		},

		/*Function sets all the Ideation field values to null*/
		ideationTabRefresh: function() {
			var oIdeationModel = this.oIdeationModel;
			var oIdeationVisiblityModel = this.oIdeationVisiblityModel;
			oIdeationModel.setProperty("/brand", "");
			oIdeationModel.setProperty("/description", "");
			oIdeationModel.setProperty("/individualPackageSize", "");
			oIdeationModel.setProperty("/sapProductDescription", "");
			oIdeationModel.setProperty("/upc", "");
			oIdeationModel.setProperty("/packageType", "");
			oIdeationModel.setProperty("/packageCount", "");
			oIdeationModel.setProperty("/individualPackageSize", "");
			oIdeationModel.setProperty("/individualPackageSizeUom", "");
			oIdeationModel.setProperty("/storeTemperatureZone", "");
			oIdeationModel.setProperty("/materialType", "");
			oIdeationModel.setProperty("/buom", "");
			oIdeationModel.setProperty("/PLUCode", "");
			oIdeationModel.setProperty("/merchantProductFlavour", "");
			oIdeationModel.setProperty("/purchaseGroup", "");
			oIdeationModel.setProperty("/newBrand", "");
			oIdeationModel.setProperty("/targetActivation", false);
			oIdeationModel.setProperty("/targetActivationDate", "");
			oIdeationModel.setProperty("/tier1", "");
			oIdeationModel.setProperty("/tier2", "");
			oIdeationModel.setProperty("/tier3", "");
			oIdeationModel.setProperty("/tier4", "");
			oIdeationModel.setProperty("/attribute1", "");
			oIdeationModel.setProperty("/attribute2", "");
			oIdeationModel.setProperty("/attribute3", "");
			oIdeationModel.setProperty("/attribute4", "");

			oIdeationVisiblityModel.setProperty("/sapProdDescEditEnabled", false);
			oIdeationVisiblityModel.setProperty("/UPCInvalidVisiblity", false);
			oIdeationVisiblityModel.setProperty("/UPCValidVisiblity", false);
			oIdeationVisiblityModel.setProperty("/UPCCheckboxState", false);
			oIdeationVisiblityModel.setProperty("/sapProdDescValidVisiblity", false);
			oIdeationVisiblityModel.setProperty("/sapProdDescInvalidVisiblity", false);
		},

		onSave: function() {
			var sessionToken = generateJWT.requestSessionToken("00038000016110");
			//		var getGDSNData = generateJWT.searchGTIN(sessionToken, "00038000016110");
			var dummy;
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