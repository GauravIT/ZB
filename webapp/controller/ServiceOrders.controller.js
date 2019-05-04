sap.ui.define([
	"ZBethyl/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function(BaseController, History, JSONModel, MessageToast, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("ZBethyl.controller.ServiceOrders", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZBethyl.view.ServiceOrders
		 */
		onInit: function() {

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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZBethyl.view.ServiceOrders
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZBethyl.view.ServiceOrders
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZBethyl.view.ServiceOrders
		 */
		//	onExit: function() {
		//
		//	}

	});

});