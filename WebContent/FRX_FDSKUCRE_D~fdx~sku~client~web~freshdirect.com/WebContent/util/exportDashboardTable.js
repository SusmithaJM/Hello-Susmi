jQuery.sap.declare("freshdirect.SKU.util.exportDashboardTable");
freshdirect.SKU.util.exportDashboardTable = {
		
	onExportToCSV: function(dashboardController) {
		this.formatter = freshdirect.SKU.formatter.formatter;
		var oResourceModel = dashboardController.oResourceModel;
		jQuery.sap.require("sap/ui/core/util/Export");
		jQuery.sap.require("sap/ui/core/util/ExportTypeCSV");
	
		var oExport = new sap.ui.core.util.Export({
			exportType: new sap.ui.core.util.ExportTypeCSV({
				separatorChar: "\t",
				mimeType: "application/vnd.ms-excel",
				charset: "utf-8",
				fileExtension: "xls"
			}),
			models: dashboardController.oDashboardTableModel,
			rows: {
				path: "/listRequestDto"
			},
			columns: [{ /* IDEATION_TAB*/
				name: oResourceModel.getText("PROJECT_ID"),
				template: {
					content: "{processId}"
				}
			}, {
				name: oResourceModel.getText("REQUEST_ID"),
				template: {
					content: "{requestId}"
				}
			}, {
				name: oResourceModel.getText("IDEATION"),
				template: {
					content: {
						parts : ["iImage"],
						formatter : this.formatter.formatSKUPhase
					}
				}
			}, {
				name: oResourceModel.getText("FEASABILITY"),
				template: {
					content: {
						parts : ["fImage"],
						formatter : this.formatter.formatSKUPhase
					}
				}
			}, {
				name: oResourceModel.getText("COMMERCIALIZATION"),
				template: {
					content: {
						parts : ["cImage"],
						formatter : this.formatter.formatSKUPhase
					}
				}
			}, {
				name: oResourceModel.getText("REFERENCE_GTIN"),
				template: {
					content: "{ideationDto/referenceGtin}"
				}
			}, {
				name: oResourceModel.getText("BRAND"),
				template: {
					content: "{ideationDto/brand}"
				}
			}, {
				name: oResourceModel.getText("DESCRIPTION"),
				template: {
					content: "{ideationDto/description}"
				}
			}, {
				name: oResourceModel.getText("MATERIAL_TYPE"),
				template: {
					content: "{ideationDto/materialType}"
				}
			}, {
				name: oResourceModel.getText("MANUFACTURER"),
				template: {
					content: "{ideationDto/manufacturerGLN}"
				}
			}, {
				name: oResourceModel.getText("PROFIT_CENTER"),
				template: {
					content: "{ideationDto/profitCenter}"
				}
			}, {
				name: oResourceModel.getText("UPC_PRODUCT"),
				template: {
					content: {
						parts : ["ideationDto/isNonUpcProduct"],
						formatter : this.formatter.formatDropdownKey
					}
				}
			}, {
				name: oResourceModel.getText("PACKAGE_COUNT"),
				template: {
					content: "{ideationDto/packageCount}"
				}
			}, {
				name: oResourceModel.getText("PACKAGE_TYPE"),
				template: {
					content: "{ideationDto/packageType}"
				}
			}, {
				name: oResourceModel.getText("INDIVIDUAL_PACKAGE_SIZE"),
				template: {
					content: "{ideationDto/individualPackageSize}"
				}
			}, {
				name: oResourceModel.getText("INDIVIDUAL_PACKAGE_SIZE_UOM"),
				template: {
					content: "{ideationDto/individualPackageSizeUom}"
				}
			}, {
				name: oResourceModel.getText("SAP_PRODUCT_DESCRIPTION"),
				template: {
					content: "{ideationDto/sapProductDescription}"
				}
			}, {
				name: oResourceModel.getText("PURCHASING_GROUP"),
				template: {
					content: "{ideationDto/purchasingGroup}"
				}
			}, {
				name: oResourceModel.getText("STORAGE_TEMP_ZONE"),
				template: {
					content: "{ideationDto/storageTemperatureZone}"
				}
			}, {
				name: oResourceModel.getText("TARGET_ACTIVATION_DATE"),
				template: {
					content: {
						parts : ["ideationDto/targetActivationDate"],
						formatter : this.formatter.formatDateObject
					}
				}
			}, {
				name: oResourceModel.getText("TARGET_ACTIVATION"),
				template: {
					content: {
						parts : ["ideationDto/targetActivation"],
						formatter : this.formatter.formatDropdownKey
					}
				}
			}, {
				name: oResourceModel.getText("GTIN_EA"),
				template: {
					content: "{ideationDto/gtinEA}"
				}
			}, {
				name: oResourceModel.getText("INDIVIDUAL_PACKAGE_COUNT_EACH"),
				template: {
					content: "{ideationDto/individualPackageCountEA}"
				}
			}, {
				name: oResourceModel.getText("INDIVIDUAL_PACKAGE_SIZE_EACH"),
				template: {
					content: "{ideationDto/individualPackageSizeEA}"
				}
			}, {
				name: oResourceModel.getText("GTIN_IN"),
				template: {
					content: "{ideationDto/gtinIN}"
				}
			}, {
				name: oResourceModel.getText("N0_INDIVIDUAL_PACKAGES_INNER"),
				template: {
					content: "{ideationDto/noOfIndividualPackageIN}"
				}
			}, {
				name: oResourceModel.getText("GTIN_CS"),
				template: {
					content: "{ideationDto/gtinCS}"
				}
			}, {
				name: oResourceModel.getText("N0_INDIVIDUAL_INNER_CASE"),
				template: {
					content: "{ideationDto/noOfIndividualPacksCS}"
				}
			}, {
				name: oResourceModel.getText("N0_INDIVIDUAL_PACKAGES_CASE"),
				template: {
					content: "{ideationDto/noOfIndividualPacksCS}"
				}
			}, {
				name: oResourceModel.getText("TIER1"),
				template: {
					content: "{ideationDto/tier1}"
				}
			}, {
				name: oResourceModel.getText("TIER2"),
				template: {
					content: "{ideationDto/tier2}"
				}
			}, {
				name: oResourceModel.getText("TIER3"),
				template: {
					content: "{ideationDto/tier3}"
				}
			}, {
				name: oResourceModel.getText("TIER4"),
				template: {
					content: "{ideationDto/tier4}"
				}
			}, {
				name: oResourceModel.getText("ATTRIBUTE1"),
				template: {
					content: "{ideationDto/attribute1}"
				}
			}, {
				name: oResourceModel.getText("ATTRIBUTE2"),
				template: {
					content: "{ideationDto/attribute2}"
				}
			}, {
				name: oResourceModel.getText("ATTRIBUTE3"),
				template: {
					content: "{ideationDto/attribute3}"
				}
			}, {
				name: oResourceModel.getText("ATTRIBUTE4"),
				template: {
					content: "{ideationDto/attribute4}"
				}
			}, {
				name: oResourceModel.getText("CREATED_DATE"),
				template: {
					content : {
						parts : ["ideationDto/createdOn"],
						formatter : this.formatter.formatDateObject
					}	
				}
			}, {
				name: oResourceModel.getText("CREATED_BY"),
				template: {
					content: "{ideationDto/createdBy}"
				}
			}, {
				name: oResourceModel.getText("SUBMITTED_DATE"),
				template: {
					content: {
						parts : ["ideationDto/submittedDate"],
						formatter : this.formatter.formatDateObject
					}	
				}
			}, {
				name: oResourceModel.getText("UPDATED_BY"),
				template: {
					content: "{ideationDto/updatedBy}"
				}
			}, {
				name: oResourceModel.getText("UPDATED_DATE"),
				template: {
					content: {
						parts : ["ideationDto/updatedOn"],
						formatter : this.formatter.formatDateObject
					}
				}
			}, { /*BASIC_ATTRIBUTE_TAB*/
				name: oResourceModel.getText("STORAGE_TEMP_RANGE"),
				template: {
					content: "{basicAttributeDto/storeTemperatureRange}"
				}
			}, {
				name: oResourceModel.getText("STORAGE_TEMO_OTHER_TEXT"),
				template: {
					content: "{basicAttributeDto/storeTemperatureText}"
				}
			}, {
				name: oResourceModel.getText("STORAGE_TEMP_MIN"),
				template: {
					content: "{basicAttributeDto/storeTemperatureMinimum}"
				}
			}, {
				name: oResourceModel.getText("STORAGE_TEMP_MAX"),
				template: {
					content: "{basicAttributeDto/storeTemperatureMaximum}"
				}
			}, {
				name: oResourceModel.getText("STORAGE_CONDITION"),
				template: {
					content: "{basicAttributeDto/storeCondition}"
				}
			}, {
				name: oResourceModel.getText("STORAGE_CONDITION_TEXT"),
				template: {
					content: "{basicAttributeDto/storeConditionText}"
				}
			}, {
				name: oResourceModel.getText("VARIABLE_WEIGHT_PRODUCT"),
				template: {
					content: "{basicAttributeDto/variableWeightProduct}"
				}
			}, {
				name: oResourceModel.getText("PRODUCT_DATE_CODED"),
				template: {
					content: "{basicAttributeDto/productDateCoded}"
				}
			}, {
				name: oResourceModel.getText("VARIABLE_WEIGHT_LABEL_PRODUCT"),
				template: {
					content: "{basicAttributeDto/variableWeightLabelProduct}"
				}
			}, {
				name: oResourceModel.getText("PRODUCT_DATING"),
				template: {
					content: "{basicAttributeDto/productDating}"
				}
			}, {
				name: oResourceModel.getText("VENDOR_ATTRIBUTES_1"),
				template: {
					content: "{basicAttributeDto/vendorAttribute1}"
				}
			}, {
				name: oResourceModel.getText("VENDOR_ATTRIBUTES_2"),
				template: {
					content: "{basicAttributeDto/vendorAttribute2}"
				}
			}, {
				name: oResourceModel.getText("vendorAttribute3"),
				template: {
					content: "{basicAttributeDto/vendorAttribute3}"
				}
			}, {
				name: oResourceModel.getText("BATCH_LOT_CODED"),
				template: {
					content: "{basicAttributeDto/batchLotCoded}"
				}
			}, {
				name: oResourceModel.getText("NUTRITION_PANEL_TYPE"),
				template: {
					content: "{basicAttributeDto/nutritionPanelType}"
				}
			}, {
				name: oResourceModel.getText("TOTAL_SHELF_LIFE"),
				template: {
					content: "{basicAttributeDto/totalShelfLife}"
				}
			}, {
				name: oResourceModel.getText("MIN_SHELF_LIFE_REQ"),
				template: {
					content: "{basicAttributeDto/minimumShelfLifeRequiredUponReceipt}"
				}
			}, {
				name: oResourceModel.getText("JUICE_PERCENTAGE"),
				template: {
					content: "{basicAttributeDto/juicePercent}"
				}
			}, {
				name: oResourceModel.getText("ALCOHOL_PERCENTAGE"),
				template: {
					content: "{basicAttributeDto/alcoholPercent}"
				}
			}, {
				name: oResourceModel.getText("PRI_SRC_MIN_SHELF_LIFE_REQ_RECEIPT"),
				template: {
					content: "{basicAttributeDto/priSrcMinShelfLifeReqUponReceipt}"
				}
			}, {
				name: oResourceModel.getText("SEC_SRC_MIN_SHELF_LIFE_REQ_RECEIPT"),
				template: {
					content: "{basicAttributeDto/secSrcMinShelfLifeReqUponReceipt}"
				}
			}, {
				name: oResourceModel.getText("GUARANTEED_DAYS_FRESH"),
				template: {
					content: "{basicAttributeDto/guaranteedDaysFreshToCustomer}"
				}
			}, {
				name: oResourceModel.getText("BOTTLES_DEPOSIT_REQ"),
				template: {
					content: "{basicAttributeDto/bottleDepositRequired}"
				}
			}, {
				name: oResourceModel.getText("BRAND_OWNER"),
				template: {
					content: "{brandOwnerDto/brandOwner}"
				}
			}, {
				name: oResourceModel.getText("BRAND_OWNER_CONTACT_NO"),
				template: {
					content: "{brandOwnerDto/contactName}"
				}
			}, {
				name: oResourceModel.getText("BRAND_OWNER_CONTACT_EMAIL"),
				template: {
					content: "{brandOwnerDto/contactEmail}"
				}
			}, {
				name: oResourceModel.getText("BRAND_OWNER_CONTACT_TITLE"),
				template: {
					content: "{brandOwnerDto/contactTitle}"
				}
			}, {
				name: oResourceModel.getText("BRAND_OWNER_CONTACT_PHONE"),
				template: {
					content: "{brandOwnerDto/contactPhone}"
				}
			}, {
				name: oResourceModel.getText("PRODUCT_WEBSITE_LINK"),
				template: {
					content: "{brandOwnerDto/productWebLink}"
				}
			}, {
				name: oResourceModel.getText("GDSN_CAPABLE"),
				template: {
					content: "{brandOwnerDto/gdsnCapable}"
				}
			}, {
				name: oResourceModel.getText("GDSN_PUBLISHED_TO_FD"),
				template: {
					content: "{brandOwnerDto/gdsnPublishedToFD}"
				}
			}, { /*  BINNING_TAB  */
				name: oResourceModel.getText("AVERAGE_FORECAST_WEEKLY_VOLUME"),
				template: {
					content: "{binningDto/avgForecasteWeeklyVolume}"
				}
			}, {
				name: oResourceModel.getText("MINIMUM_ITEM_ORDER_QUANTITY"),
				template: {
					content: "{binningDto/minItemOrderQuantity}"
				}
			}, {
				name: oResourceModel.getText("UNIT_PER_CASE"),
				template: {
					content: "{binningDto/unitPerCase}"
				}
			}, {
				name: oResourceModel.getText("CASES_PER_PALLET"),
				template: {
					content: "{binningDto/casesPerPallet}"
				}
			}, {
				name: oResourceModel.getText("PICK_DEPT"),
				template: {
					content: "{binningDto/pickDepartment}"
				}
			},{
				name: oResourceModel.getText("PICK_METHOD"),
				template: {
					content: "{binningDto/pickMethod}"
				}
			},{
				name: oResourceModel.getText("IS_MIN_ORDER_QTY"),
				template: {
					content: {
						parts : ["binningDto/isMinimumOrderQty"],
						formatter : this.formatter.formatDropdownKey
					}
				}
			},{
				name: oResourceModel.getText("APPLICABLE_FOR_SHUTTLE"),
				template: {
					content: {
						parts : ["binningDto/applicableForShuttle" , "binningDto/isMinimumOrderQty"],
						formatter : this.formatter.isMOQApplicable
					}	
				}
			}, {
				name: oResourceModel.getText("RESERVE_PALLET_POSITION_AVAILABLE"),
				template: {
					content: {
						parts : ["binningDto/reservePalletPositionAvailable" , "binningDto/isMinimumOrderQty"],
						formatter : this.formatter.isMOQApplicable
					}
				}
			}, { /*      SOURCE_INFO_PRIMARY*/
				name: oResourceModel.getText("SOLE_SOURCED"),
				template: {
					content: {
						parts : ["sourceInfoDtos/0/sourceInfoDto/soleSrcedProduct"],
						formatter : this.formatter.formatBooleanVal
					}
				}
			}, {
				name: oResourceModel.getText("VENDOR_NUMBER"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/sourceVendorNumber}"
				}
			}, {
				name: oResourceModel.getText("VENDOR_NAME"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/vendorName}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_TYPE"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/sourceType}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_IS_NEW_SOURCE_FOR_FD"),
				template: {
					content: {
						parts : ["sourceInfoDtos/0/sourceInfoDto/isSrcNewForFD"],
						formatter : this.formatter.formatBooleanValue
					}
				}
			}, {
				name: oResourceModel.getText("COVERED_UNDER_SOURCE_CONTARCT"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/isCoveredUnderSrcContract}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_CONTRACT_ID"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/sourceContractId}"
				}
			}, {
				name: oResourceModel.getText("CONTACT_NAME"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/contactName}"
				}
			}, {
				name: oResourceModel.getText("CONTACT_TITLE"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/contactTitle}"
				}
			}, {
				name: oResourceModel.getText("EMAIL"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/email}"
				}
			}, {
				name: oResourceModel.getText("PHONE_NUMBER"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/phoneNo}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_WILL_DELIVER"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/willSrcDeliver}"
				}
			}, {
				name: oResourceModel.getText("PAYMENT_TERMS"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/paymentTerms}"
				}
			}, {
				name: oResourceModel.getText("INCOTERMS"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/incoterms}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_ALLOWS_CUST_PICK_UP"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/doSrcAllowCustomerPickup}"
				}
			}, {
				name: oResourceModel.getText("LEAD_TIME"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/leadTime}"
				}
			}, {
				name: oResourceModel.getText("FIRST_ORDER_DELIVERY_PICKUP"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/isFirstOrderDelOrPickup}"
				}
			}, {
				name: oResourceModel.getText("STREET_ADDRESS1"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/streetAddress1}"
				}
			}, {
				name: oResourceModel.getText("STREET_ADDRESS2"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/streetAddress2}"
				}
			},{
				name: oResourceModel.getText("COUNTRY"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/country}"
				}
			}, {
				name: oResourceModel.getText("STATE"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/state}"
				}
			}, {
				name: oResourceModel.getText("CITY"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/city}"
				}
			}, {
				name: oResourceModel.getText("ZIP"),
				template: {
					content: "{sourceInfoDtos/0/sourceInfoDto/zip}"
				}
			}, { /*   Cost Sheet Primary   */
				name: oResourceModel.getText("HIERARCHY_CHOSEN"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/HierarchyChosen}"
				}
			}, {
				name: oResourceModel.getText("ORDERABLE"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Orderable}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_PRICING"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/BracketPricing}"
				}
			}, {
				name: oResourceModel.getText("COSTING_UOM"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/CostingUOM}"
				}
			}, {
				name: oResourceModel.getText("SCRAP_ALLOWANCE_APPLICABLE_ON"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/ScrapallowanceApplicableon}"
				}
			}, {
				name: oResourceModel.getText("TEMP_OI_EFFECTIVE_ON"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/TempOIsEffectiveon}"
				}
			}, {
				name: oResourceModel.getText("OI_APPLIED_ON"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/OIsappliedon}"
				}
			}, {
				name: oResourceModel.getText("BILLBACK_ON_ACCRUAL_APPLICABLE_ON"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/BillbackonAccrualapplicableon}"
				}
			}, {
				name: oResourceModel.getText("NO_OF_BOTTLES_EA"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NoofBottlesEA}"
				}
			}, {
				name: oResourceModel.getText("APPLICABLE_STATE"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/ApplicableState}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_1_RANGE"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket1RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET1_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket1GrossPriceCS}"
				}
			}, {
				name: oResourceModel.getText("BRACKET1_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket1GrossPriceEA}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_2_RANGE"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket2RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET2_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket2GrossPriceCS}"
				}
			}, {
				name: oResourceModel.getText("BRACKET2_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket2GrossPriceEA}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_3_RANGE"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket3RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET3_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket3GrossPriceCS}"
				}
			}, {
				name: oResourceModel.getText("BRACKET3_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket3GrossPriceEA}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_4_RANGE"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket4RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET4_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket4GrossPriceCS}"
				}
			}, {
				name: oResourceModel.getText("BRACKET4_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket4GrossPriceEA}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_5_RANGE_HIGH"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket5RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_5_RANGE_LOW"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket5RangeLow}"
				}
			}, {
				name: oResourceModel.getText("BRACKET5_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket5GrossPriceCS}"
				}
			}, {
				name: oResourceModel.getText("BRACKET5_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/Bracket5GrossPriceEA}"
				}
			}, {
				name: oResourceModel.getText("PICK_UP_COST_SELECTED_BRACKET"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/PickUpCostSelectedBracket}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_PRE-HEADER_FEES_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPre-Headerfees(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_HEADRE_COST_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetHeaderCost(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_fEES_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPost-Headerfees(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_AND_ACCURALS_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPost-HeaderfeesandAccruals(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADERS_FEES_AND_EPD_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPost-HeaderfeesandEPD(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("DEAD_NET_ITEM_INBOUND_COST(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/DeadNetItemInboundcost4(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("DELIVERED_COST_SELECTED_BRACKET"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/DeliveredCostSelectedBracket}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_PRE-HEADER_FEES_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPre-Headerfees(Delivered - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_HEADER_COST_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetHeaderCost(Delivered-CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPost-Headerfees(Delivered-CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_AND_ACCURALS_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPost-HeaderfeesandAccruals(Delivered - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_AND_EPD_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/NetItemCostPost-HeaderfeesandEPD(Delivered - CS)}"
				}
			}, {
				name: oResourceModel.getText("DEAD_NET_ITEM_INBOUND_COST_(DELIVERED)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/DeadNetItemInboundcost5(Delivered)}"
				}
			}, {
				name: oResourceModel.getText("COST_OF_DELIVERY_INCLUDED_(COST_CS)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/costofDeliveryincludedCS}"
				}
			}, {
				name: oResourceModel.getText("COST_OF_DELIVERY_INCLUDED_(COST_EA)"),
				template: {
					content: "{sourceInfoDtos/0/costSheetDto/costofDeliveryincludedEA}}"
				}
			}, {          /*      ORDERING_INFO_PRIMARY    */
				name: oResourceModel.getText("SOURCE_ITEM_NO"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/sourceItemNo}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_PRODUCT_DESC"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/description}"
				}
			}, {
				name: oResourceModel.getText("ORDER_UNIT_MEASURE"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/orderUom}"
				}
			}, {
				name: oResourceModel.getText("ORDER_UNIT_GTIN"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/ordersUnitGtin}"
				}
			}, {
				name: oResourceModel.getText("UNIT_PER_CASE"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/unitsPerCase}"
				}
			}, {
				name: oResourceModel.getText("CASES_PER_LAYER"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/casesPerLayer}"
				}
			}, {
				name: oResourceModel.getText("LAYERS_PER_PALLET"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/layersPerPallet}"
				}
			}, {
				name: oResourceModel.getText("CASES_PER_PALLET"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/casesPerPallet}"
				}
			}, {
				name: oResourceModel.getText("MINIMUM_ITEM_ORDER_QUANTITY"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/minItemOrderQuantity}"
				}
			}, {
				name: oResourceModel.getText("ORDER_MULTIPLE"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/orderMultiple}"
				}
			}, {
				name: oResourceModel.getText("ORDER_MAXIMUM"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/orderMaximum}"
				}
			}, {
				name: oResourceModel.getText("MIN_ORDER_LEVL_ORDER_QUANTITY"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/minOrderLevelOrderQuantity}"
				}
			}, {
				name: oResourceModel.getText("MIN_GUARANTED_SHELF_LIFE_DERIVED"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/minGuaranteedShelfLifeDerived}"
				}
			}, {
				name: oResourceModel.getText("COUNTRY_OF_ORIGIN"),
				template: {
					content: "{sourceInfoDtos/0/orderInfoDto/countryOfOrigin}"
				}
			}, { /*      SOURCE_INFO_SECONDARY*/
				name: oResourceModel.getText("SOLE_SOURCED"),
				template: {
					content: {
						parts : ["sourceInfoDtos/1/sourceInfoDto/soleSrcedProduct}"],
						formatter : this.formatter.formatBooleanVal
					}
				}
			}, {
				name: oResourceModel.getText("VENDOR_NUMBER"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/sourceVendorNumber}"
				}
			}, {
				name: oResourceModel.getText("VENDOR_NAME"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/vendorName}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_TYPE"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/sourceType}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_IS_NEW_SOURCE_FOR_FD"),
				template: {
					content: {
						parts : ["sourceInfoDtos/1/sourceInfoDto/isSrcNewForFD"],
						formatter : this.formatter.formatBooleanValue
					}	
				}
			}, {
				name: oResourceModel.getText("COVERED_UNDER_SOURCE_CONTARCT"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/isCoveredUnderSrcContract}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_CONTRACT_ID"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/sourceContractId}"
				}
			}, {
				name: oResourceModel.getText("CONTACT_NAME"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/contactName}"
				}
			}, {
				name: oResourceModel.getText("CONTACT_TITLE"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/contactTitle}"
				}
			}, {
				name: oResourceModel.getText("EMAIL"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/email}"
				}
			}, {
				name: oResourceModel.getText("PHONE_NUMBER"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/phoneNo}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_WILL_DELIVER"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/willSrcDeliver}"
				}
			}, {
				name: oResourceModel.getText("PAYMENT_TERMS"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/paymentTerms}"
				}
			}, {
				name: oResourceModel.getText("INCOTERMS"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/incoterms}"
				}
			}, {
				name: oResourceModel.getText("LEAD_TIME"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/leadTime}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_ALLOWS_CUST_PICK_UP"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/doSrcAllowCustPickup}"
				}
			}, {
				name: oResourceModel.getText("FIRST_ORDER_DELIVERY_PICKUP"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/isFirstOrderDelOrPickup}"
				}
			}, {
				name: oResourceModel.getText("STREET_ADDRESS1"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/streetAddress1}"
				}
			}, {
				name: oResourceModel.getText("STREET_ADDRESS2"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/streetAddress2}"
				}
			}, {
				name : oResourceModel.getText("COUNTRY"),
				template : {
					content : "{soucreInfoDtos/1/sourceInfoDto/country}"
				}
			},{
				name: oResourceModel.getText("STATE"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/state}"
				}
			}, {
				name: oResourceModel.getText("CITY"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/city}"
				}
			}, {
				name: oResourceModel.getText("ZIP"),
				template: {
					content: "{sourceInfoDtos/1/sourceInfoDto/zip}"
				}
			}, { /*   COST_SHEET_SECONDARY   */
				name: oResourceModel.getText("HIERARCHY_CHOSEN"),
				template: {
					content: "{sourceInfoDtos/1/HierarchyChosen}"
				}
			}, {
				name: oResourceModel.getText("ORDERABLE"),
				template: {
					content: "{sourceInfoDtos/1/Orderable}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_PRICING"),
				template: {
					content: "{sourceInfoDtos/1/BracketPricing}"
				}
			}, {
				name: oResourceModel.getText("COSTING_UOM"),
				template: {
					content: "{sourceInfoDtos/1/CostingUOM}"
				}
			}, {
				name: oResourceModel.getText("SCRAP_ALLOWANCE_APPLICABLE_ON"),
				template: {
					content: "{sourceInfoDtos/1/ScrapallowanceApplicableon}"
				}
			}, {
				name: oResourceModel.getText("TEMP_OI_EFFECTIVE_ON"),
				template: {
					content: "{sourceInfoDtos/1/TempOIsEffectiveon}"
				}
			}, {
				name: oResourceModel.getText("OI_APPLIED_ON"),
				template: {
					content: "{sourceInfoDtos/1/OIsappliedon}"
				}
			}, {
				name: oResourceModel.getText("BILLBACK_ON_ACCRUAL_APPLICABLE_ON"),
				template: {
					content: "{sourceInfoDtos/1/BillbackonAccrualapplicableon}"
				}
			}, {
				name: oResourceModel.getText("NO_OF_BOTTLES_EA"),
				template: {
					content: "{sourceInfoDtos/1/NoofBottlesEA}"
				}
			}, {
				name: oResourceModel.getText("APPLICABLE_STATE"),
				template: {
					content: "{sourceInfoDtos/1/ApplicableState}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_1_RANGE"),
				template: {
					content: "{sourceInfoDtos/1/Bracket1Range}"
				}
			}, {
				name: oResourceModel.getText("BRACKET1_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket1GrossPrice($/CS)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET1_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket1GrossPrice($/EA)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_2_RANGE"),
				template: {
					content: "{sourceInfoDtos/1/Bracket2RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET2_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket2GrossPrice($/CS)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET2_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket2GrossPrice($_EA)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_3_RANGE"),
				template: {
					content: "{sourceInfoDtos/1/Bracket3RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET3_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket3GrossPrice($_CS)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET3_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket3GrossPrice($_EA)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_4_RANGE"),
				template: {
					content: "{sourceInfoDtos/1/Bracket4RangeHigh}"
				}
			}, {
				name: oResourceModel.getText("BRACKET4_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket4GrossPrice($_CS)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET4_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket4GrossPrice($_EA)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET_5_RANGE_HIGH"),
				template: {
					content: "{sourceInfoDtos/1/Bracket5Range}"
				}
			}, {
				name: oResourceModel.getText("BRACKET5_GROSS_PRICE($_CS)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket5GrossPrice($_CS)}"
				}
			}, {
				name: oResourceModel.getText("BRACKET5_GROSS_PRICE($_EA)"),
				template: {
					content: "{sourceInfoDtos/1/Bracket5GrossPrice($_EA)}"
				}
			}, {
				name: oResourceModel.getText("PICK_UP_COST_SELECTED_BRACKET"),
				template: {
					content: "{sourceInfoDtos/1/PickUpCostSelectedBracket}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_PRE-HEADER_FEES_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPre-Headerfees(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_HEADRE_COST_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetHeaderCost(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_fEES_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPost-Headerfees(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText(">NET_ITEM_COST_POST-HEADER_FEES_AND_ACCURALS_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPost-HeaderfeesandAccruals(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADERS_FEES_AND_EPD_(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPost-HeaderfeesandEPD(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("DEAD_NET_ITEM_INBOUND_COST(PICK_UP_CS)"),
				template: {
					content: "{sourceInfoDtos/1/DeadNetItemInboundcost4(Pick Up - CS)}"
				}
			}, {
				name: oResourceModel.getText("DELIVERED_COST_SELECTED_BRACKET"),
				template: {
					content: "{sourceInfoDtos/1/DeliveredCostSelectedBracket}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_PRE-HEADER_FEES_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPre-Headerfees(Delivered - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_HEADER_COST_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetHeaderCost(Delivered-CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPost-Headerfees(Delivered-CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_AND_ACCURALS_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPost-HeaderfeesandAccruals(Delivered - CS)}"
				}
			}, {
				name: oResourceModel.getText("NET_ITEM_COST_POST-HEADER_FEES_AND_EPD_(DELIVERED_CS)"),
				template: {
					content: "{sourceInfoDtos/1/NetItemCostPost-HeaderfeesandEPD(Delivered - CS)}"
				}
			}, {
				name: oResourceModel.getText("DEAD_NET_ITEM_INBOUND_COST_(DELIVERED)"),
				template: {
					content: "{sourceInfoDtos/1/DeadNetItemInboundcost5(Delivered)}"
				}
			}, {
				name: oResourceModel.getText("COST_OF_DELIVERY_INCLUDED_(COST_CS)"),
				template: {
					content: "{sourceInfoDtos/1/costofDeliveryincludedCS}"
				}
			}, {
				name: oResourceModel.getText("COST_OF_DELIVERY_INCLUDED_(COST_EA)"),
				template: {
					content: "{sourceInfoDtos/1/costofDeliveryincludedEA}}"
				}
			}, {          /*      ORDERING_INFO_SECONDARY    */
				name: oResourceModel.getText("SOURCE_ITEM_NO"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/sourceItemNo}"
				}
			}, {
				name: oResourceModel.getText("SOURCE_PRODUCT_DESC"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/description}"
				}
			}, {
				name: oResourceModel.getText("ORDER_UNIT_MEASURE"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/orderUom}"
				}
			}, {
				name: oResourceModel.getText("ORDER_UNIT_GTIN"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/orderUnitGtin}"
				}
			}, {
				name: oResourceModel.getText("UNIT_PER_CASE"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/unitsPerCase}"
				}
			}, {
				name: oResourceModel.getText("CASES_PER_LAYER"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/casesPerLayer}"
				}
			}, {
				name: oResourceModel.getText("LAYERS_PER_PALLET"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/layersPerPallet}"
				}
			}, {
				name: oResourceModel.getText("CASES_PER_PALLET"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/casesPerPallet}"
				}
			}, {
				name: oResourceModel.getText("MINIMUM_ITEM_ORDER_QUANTITY"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/minItemOrderQuantity}"
				}
			}, {
				name: oResourceModel.getText("ORDER_MULTIPLE"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/orderMultiple}"
				}
			}, {
				name: oResourceModel.getText("ORDER_MAXIMUM"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/orderMaximum}"
				}
			}, {
				name: oResourceModel.getText("MIN_ORDER_LEVL_ORDER_QUANTITY"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/minOrderLevelOrderQuantity}"
				}
			}, {
				name: oResourceModel.getText("MIN_GUARANTED_SHELF_LIFE_DERIVED"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/minGuaranteedShelfLifeDerived}"
				}
			}, {
				name: oResourceModel.getText("COUNTRY_OF_ORIGIN"),
				template: {
					content: "{sourceInfoDtos/1/orderInfoDto/countryOfOrigin}"
				}
			},{               /*   DMM_TAB     */
				name: oResourceModel.getText("STRATEGIC_JUSTIFICATION"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("RENEGOTIATION_SOURCE_DONE"),
				template: {
					content: "{dmmDto/reNegotiationsWithSourceDone}"
				}
			}, {
				name: oResourceModel.getText("APPROVED"),
				template: {
					content: "{dmmDto/approved}"
				}
			}, {
				name: oResourceModel.getText("EXCEPTION_COMMENT"),
				template: {
					content: "{}"
				}
			}, {             /*        MERCHANDISING_TAB         */
				name: oResourceModel.getText("REFERENCE_MATERIAL_NO_OF_FORECASTING"),
				template: {
					content: "{merchandisingDto/materialNo}"
				}
			}, {
				name: oResourceModel.getText("REFERENCE_MATERIAL_NO_DESC_FORECASTING"),
				template: {
					content: "{merchandisingDto/materialNoDescription}"
				}
			}, {
				name: oResourceModel.getText("REPLACEMENT_SKU"),
				template: {
					content: {
						parts : ["merchandisingDto/replacementGtin"],
						formatter : this.formatter.formatBooleanVal
					}
				}
			}, {
				name: oResourceModel.getText("REF_AVRG_WEEKLY_UNIT_VOL"),
				template: {
					content: "{merchandisingDto/referenceAvgActWeeklyUnitvolume}"
				}
			}, {
				name: oResourceModel.getText("PERCENATGE_REF_SKU_DEMAND"),
				template: {
					content: {
						parts : ["merchandisingDto/perSkuRefDemand"],
						formatter : this.formatter.formatPercentSign
					}
				}
			}, {
				name: oResourceModel.getText("AVRG_WEEKLY_UNIT_DEMAND"),
				template: {
					content: "{merchandisingDto/avgWeekUnitDemand}"
				}
			}, {
				name: oResourceModel.getText("FIRST_PO_QUANTITY"),
				template: {
					content: "{merchandisingDto/firstPOQuantityCS}"
				}
			}, {
				name: oResourceModel.getText("INCREMENTALITY_CLASSIFICATION"),
				template: {
					content: "{merchandisingDto/incClassification}"
				}
			}, {
				name: oResourceModel.getText("INCREMENTALITY_PERCENTAGE"),
				template: {
					content: "{merchandisingDto/incPercent}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK1_PER"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK1"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK2_PER"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK2"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK3_PER"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK3"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK4_PER"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK4"),
				template: {
					content: "{}"
				}
			},
			{
				name: oResourceModel.getText("FORECAST_WEEK5_PER"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK5"),
				template: {
					content: "{}"
				}
			},{
				name: oResourceModel.getText("FORECAST_WEEK6_PER"),
				template: {
					content: "{}"
				}
			}, {
				name: oResourceModel.getText("FORECAST_WEEK6"),
				template: {
					content: "{}"
				}
			},{
				name: oResourceModel.getText("MSRP"),
				template: {
					content: {
						parts : ["merchandisingDto/msrp"],
						formatter : this.formatter.formatDollarSign
					}
				}
			}, {
				name: oResourceModel.getText("MERCHANT_SUGGESTED_PRICE_FOR_EACH"),
				template: {
					content: {
						parts : ["merchandisingDto/merchantSuggPriceEA"],
						formatter : this.formatter.formatDollarSign
					}
				}
			},{
				name: oResourceModel.getText("MERCHANT_SUGGESTED_PRICE_FOR_CASE"),
				template: {
					content: {
						parts : ["merchandisingDto/merchantSuggPriceCS"],
						formatter : this.formatter.formatDollarSign
					}
				}
			}, {
				name: oResourceModel.getText("MARKET_FINAL_PRICE"),
				template: {
					content: {
						parts : ["merchandisingDto/marketFinalPriceEA"],
						formatter : this.formatter.formatDollarSign
					}
				}
			},{
				name: oResourceModel.getText("MARKET_FINAL_PRICE_CASE"),
				template: {
					content: {
						parts : ["merchandisingDto/marketFinalPriceCS"],
						formatter : this.formatter.formatDollarSign
					}
				}
			}, {     /*        STORE_FRONT_TAB         */
				name: oResourceModel.getText("PRODUCT_NAME"),
				template: {
					content: "{storeFrontDto/productName}"
				}
			},{
				name: oResourceModel.getText("MERCHANT_SUGGESTED_SEARCH_TERMS"),
				template: {
					content: "{storeFrontDto/merchantSuggSearchTerms}"
				}
			}, {
				name: oResourceModel.getText("PLACEMENT_ON_STOREFRONT"),
				template: {
					content: "{storeFrontDto/placementOnStorefront}"
				}
			},{
				name: oResourceModel.getText("ADDITIONAL_PLACEMENT_ON_STOREFRONTFRONT_A"),
				template: {
					content: "{storeFrontDto/addPlacementAtStorefrontA}"
				}
			}, {
				name: oResourceModel.getText("ADDITIONAL_PLACEMENT_ON_STOREFRONTFRONT_B"),
				template: {
					content: "{storeFrontDto/addPlacementAtStorefrontB}"
				}
			},{
				name: oResourceModel.getText("ADDITIONAL_PLACEMENT_ON_STOREFRONTFRONT_C"),
				template: {
					content: "{storeFrontDto/addPlacementAtStorefrontC}"
				}
			}, {
				name: oResourceModel.getText("ADDITIONAL_PLACEMENT_ON_STOREFRONTFRONT_D"),
				template: {
					content: "{storeFrontDto/addPlacementAtStorefrontD}"
				}
			}, {
				name: oResourceModel.getText("PRODUCT_CONTENT_COPY"),
				template: {
					content: "{}"
				}
			}, {  /*        PRODUCT_TAGS_TAB         */
				name: oResourceModel.getText("GLOBAL_TAGS"),
				template: {
					content: "{productTagsDtos/globalTags}"
				}
			},{
				name: oResourceModel.getText("CATEGORY_SPECIFICATION"),
				template: {
					content: "{productTagsDtos/categorySpecification}"
				}
			}, { /*        CFM_TAB         */
				name: oResourceModel.getText("CATEGORY_GROSS_MARGIN_TIER_1"),
				template: {
					content: "{commercialFinanceDto/categoryGrossMarginTier1}"
				}
			},{
				name: oResourceModel.getText("CATEGORY_GROSS_MARGIN_TIER_2"),
				template: {
					content: "{commercialFinanceDto/categoryGrossMarginTier2}"
				}
			}, {
				name: oResourceModel.getText("CATEGORY_GROSS_MARGIN_TIER_3"),
				template: {
					content: "{commercialFinanceDto/categoryGrossMarginTier3}"
				}
			},{
				name: oResourceModel.getText("CATEGORY_GROSS_MARGIN_TIER_4"),
				template: {
					content: "{commercialFinanceDto/categoryGrossMarginTier4}"
				}
			},{
				name: oResourceModel.getText("NET_ITEM_COST_PRE_HEADER_FEES_PRI"),
				template: {
					content: "{commercialFinanceDto/pVenPreHdrFeeCostUom}"
				}
			},{
				name: oResourceModel.getText("NET_ITEM_COST_POST_HEADER_FEES_PRI"),
				template: {
					content: "{commercialFinanceDto/pVenPostHdrFeeCostUom}"
				}
			},{
				name: oResourceModel.getText("NET_ITEM_COST_POST_HEADER_FEES_AND_ACCURALS_PRI"),
				template: {
					content: "{commercialFinanceDto/pVenPostHdrFeeAccrCostUom}"
				}
			},{
				name: oResourceModel.getText("CFM_ADJUSTMENTS_D_PRI"),
				template: {
					content: "{commercialFinanceDto/pCfmAdjustNetValue}"
				}
			},{
				name: oResourceModel.getText("CFM_ADJUSTMENTS_P_PRI"),
				template: {
					content: "{commercialFinanceDto/pCfmAdjustPerValue}"
				}
			},{
				name: oResourceModel.getText("DEAD_NET_ITEM_INBOUND_COST_PRI"),
				template: {
					content: "{commercialFinanceDto/pVendDeadInboundCostUom}"
				}
			},{
				name: oResourceModel.getText("PRICE_PRI"),
				template: {
					content: "{commercialFinanceDto/pricePerCase}"
				}
			},{
				name: oResourceModel.getText("GROSS_MARGIN_PRI"),
				template: {
					content: "{commercialFinanceDto/pGrossMarginUom}"
				}
			},{
				name: oResourceModel.getText("GROSS_MARGIN_PERC_PRI"),
				template: {
					content: "{commercialFinanceDto/pGrossMarginPercent}"
				}
			},{
				name: oResourceModel.getText("MIN_ORDER_QUANTITY_PRI}"),
				template: {
					content: "{commercialFinanceDto/pMinOrderQuantity}"
				}
			},{
				name: oResourceModel.getText("NET_ITEM_COST_PRE_HEADER_FEES_SEC"),
				template: {
					content: "{commercialFinanceDto/sVenPreHdrFeeCostUom}"
				}
			},{
				name: oResourceModel.getText("NET_ITEM_COST_POST_HEADER_FEES_SEC"),
				template: {
					content: "{commercialFinanceDto/sVenPostHdrFeeCostUom}"
				}
			},{
				name: oResourceModel.getText("NET_ITEM_COST_POST_HEADER_FEES_AND_ACCURALS_SEC"),
				template: {
					content: "{commercialFinanceDto/sVenPostHdrFeeAccrCostUom}"
				}
			},{
				name: oResourceModel.getText("CFM_ADJUSTMENTS_D_SEC"),
				template: {
					content: "{commercialFinanceDto/sCfmAdjustNetValue}"
				}
			},{
				name: oResourceModel.getText("CFM_ADJUSTMENTS_P_SEC"),
				template: {
					content: "{commercialFinanceDto/sCfmAdjustPerValue}"
				}
			},{
				name: oResourceModel.getText("DEAD_NET_ITEM_INBOUND_COST_SEC"),
				template: {
					content: "{commercialFinanceDto/sVendDeadInboundCostUom}"
				}
			},{
				name: oResourceModel.getText("PRICE_SEC"),
				template: {
					content: "{commercialFinanceDto/pricePerCase}"
				}
			},{
				name: oResourceModel.getText("GROSS_MARGIN_SEC"),
				template: {
					content: "{commercialFinanceDto/sGrossMarginUom}"
				}
			},{
				name: oResourceModel.getText("GROSS_MARGIN_PER_SEC"),
				template: {
					content: "{commercialFinanceDto/sGrossMarginPercent}"
				}
			},{
				name: oResourceModel.getText("MIN_ORDER_QUANTITY_SEC"),
				template: {
					content: "{commercialFinanceDto/sMinOrderQuantity}"
				}
			},{
				name: oResourceModel.getText("AVG_FROECAST_WEEKLY_UNIT_DEMAND"),
				template: {
					content: "{commercialFinanceDto/avgForcastWeekDemand}"
				}
			},{
				name: oResourceModel.getText("REFERENCE_MATERIAL"),
				template: {
					content: "{commercialFinanceDto/referenceMat}"
				}
			},{
				name: oResourceModel.getText("REFERENCE_MATERIAL_DESCRIPTION"),
				template: {
					content: "{commercialFinanceDto/referenceMatDesc}"
				}
			},{
				name: oResourceModel.getText("GMROI"),
				template: {
					content: "{commercialFinanceDto/gmroi}"
				}
			},{
				name: oResourceModel.getText("ANNUAL_D_GAIN_LOSS_PRIMARY_VS_SECONDARY"),
				template: {
					content: "{commercialFinanceDto/annulDollarGainLossPriSec}"
				}
			},{
				name: oResourceModel.getText("ANNUAL_$_GAIN_LOSS_IN_CATEGORY"),
				template: {
					content: "{commercialFinanceDto/annulDollarGainLossInCategory}"
				}
			},{
				name: oResourceModel.getText("NPV_CS"),
				template: {
					content: "{commercialFinanceDto/npvPerCS}"
				}
			},{
				name: oResourceModel.getText("NPV_EA"),
				template: {
					content: "{commercialFinanceDto/npvPerEA}"
				}
			},{
				name: oResourceModel.getText("IRR"),
				template: {
					content: "{commercialFinanceDto/irr}"
				}
			},{
				name: oResourceModel.getText("APPROVED"),
				template: {
					content: "{commercialFinanceDto/approved}"
				}
			},{
				name: oResourceModel.getText("COMMENTS"),
				template: {
					content: "{commercialFinanceDto/comments}"
				}
			},{
				name: oResourceModel.getText(""),
				template: {
					content: "{}"
				}
			},{
				name: oResourceModel.getText(""),
				template: {
					content: "{}"
				}
			},{
				name: oResourceModel.getText(""),
				template: {
					content: "{}"
				}
			}]
		});
		oExport.saveFile("SKU TABLE"); // download exported file
	}
};
