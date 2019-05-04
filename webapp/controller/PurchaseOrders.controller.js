sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function(jQuery, MessageToast, Fragment, Controller, Filter, JSONModel, History, Device) {
	"use strict";

	return Controller.extend("ZBethyl.controller.PurchaseOrders", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZBethyl.view.PurchaseOrders
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZBethyl.view.PurchaseOrders
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZBethyl.view.PurchaseOrders
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZBethyl.view.PurchaseOrders
		 */
		//	onExit: function() {
		//
		//	}
		
		
		
		
		
		
		
		
		onInit: function(){
			// this.getSplitAppObj().setHomeIcon({
			// 	'phone':'phone-icon.png',
			// 	'tablet':'tablet-icon.png',
			// 	'icon':'desktop.ico'
			// });
		},
		
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator;

			// if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},
 
		// onOrientationChange: function(oEvent) {
		// 	var bLandscapeOrientation = oEvent.getParameter("landscape"),
		// 		sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
		// 	MessageToast.show(sMsg, {duration: 5000});
		// },
 
		// onPressNavToDetail : function(oEvent) {
		// 	this.getSplitAppObj().to(this.createId("detailDetail"));
		// },
 
		// onPressDetailBack : function() {
		// 	this.getSplitAppObj().backDetail();
		// },
 
		// onPressMasterBack : function() {
		// 	this.getSplitAppObj().backMaster();
		// },
 
		// onPressGoToMaster : function() {
		// 	this.getSplitAppObj().toMaster(this.createId("master2"));
		// },
 
		// onListItemPress : function(oEvent) {
		// 	var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
 
		// 	this.getSplitAppObj().toDetail(this.createId(sToPageId));
		// },
 
		// onPressModeBtn : function(oEvent) {
		// 	var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();
 
		// 	this.getSplitAppObj().setMode(sSplitAppMode);
		// 	MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, {duration: 5000});
		// },
 
		// getSplitAppObj : function() {
		// 	var result = this.byId("SplitAppDemo");
		// 	if (!result) {
		// 		jQuery.sap.log.info("SplitApp object can't be found");
		// 	}
		// 	return result;
		// },
		
		onAfterRendering: function() {
			//set nav button true for mobile
			if(Device.system.phone){
				this.getView().byId("idDetail").setShowNavButton(true);
			}
		},

		onListItemPress: function(oEvent) {
			//list item press handler
			var selItem = oEvent.getSource().getBindingContext("so").sPath;
			var selIndex = selItem.split("/")[2];
			var selSOJson = this.getView().getModel("so").getData().SOList[selIndex];
			this.byId("idSODetailForm").setVisible(true);
			this.byId("idSplitApp").toDetail(this.createId("idDetail"));
			this._showSelectedSODetails(selSOJson);
			this.getView().byId("productionOrdersTabBar").setVisible(true);
		},
		
		onSOSearch: function(oEvent){
			//live search handler
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if(sQuery && sQuery.length > 0){
				var filter = new Filter("soNo", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			//update bindings
			var list = this.byId("idSOList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		formatstatus : function(sStatus){
			if (sStatus === "Confirmed") {
			return "Success";
			} else if (sStatus === "In Process") {
			return "Warning";
			} else if (sStatus === "Out Of Stock"){
			return "Error";
			} else {
			return "None";
			}
		},

		_showSelectedSODetails: function(selSOJson) {
			//display content of SO Details
			this.getView().byId("idSoNo").setText(selSOJson.soNo);
			this.getView().byId("idSoName").setText(selSOJson.soName);
			this.getView().byId("idSoDesc").setText(selSOJson.soDesc);
			this.getView().byId("idSoPrice").setText(selSOJson.soPrice);
			this.getView().byId("idSoDate").setText(selSOJson.soDate);
			
			var oModel = new sap.ui.model.json.JSONModel(selSOJson.soItems);
			var oTemplate = new sap.m.ColumnListItem({
				type: sap.m.ListType.Active,
				cells : [
					new sap.m.Label({
		                 text : "{soItemMaterial}"
					}),
					new sap.m.Label({
		                 text: "{soItemMatShipTo}"
					}),
					new sap.m.Label({
		                 text: "{soItemMatInvoiceTo}"
					}),
					new sap.m.Label({
		                 text: "{soItemMatStatus}"
					})
				]
			});
			this.getView().byId("idProductsTable").setModel(oModel);
			this.getView().byId("idProductsTable").bindAggregation("items","/",oTemplate);
		},

		onPressDetailBack: function() {
			//show master page
			this.byId("idSplitApp").toDetail(this.createId("idMaster"));
		}
		
		
		

	});

});