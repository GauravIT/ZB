/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/m/Text"

], function(Controller, History, MessageBox, MessageToast, Dialog, Button, TextArea, Text) {
	"use strict";

	return Controller.extend("ZBethyl.controller.BaseController", {
		onInit: function() {},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for retrieving a root model
		 */
		getRootModel: function(sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				this.getRouter().navTo("index", {}, true);
			}
		},

		treeCallbackRefresh: function(callback) {
			var eventBus = sap.ui.getCore().getEventBus();

			eventBus.publish("master", "refreshTreeCallback", callback);
		},

		// Delegates the expand tree event to the master controller
		expandToNode: function(nodeId) {
			var eventBus = sap.ui.getCore().getEventBus();

			eventBus.publish("master", "expandTree", nodeId);
		},

		_insertSectionHistory: function(sectionId, action, type, remarks) {
			var that = this;
			var oHistoryModel = this.getRootModel();
			var oHistoryData = {
				"SectionId": Number(sectionId),
				"Action": action,
				"Type": type,
				"Remarks": remarks ? remarks : ""
			};
			oHistoryModel.create("/SECTION_HISTORYSet", oHistoryData, {
				success: function(oData, response) {
				},
				error: function(oError) {
					that.showErrorBox("Saving to History Failed");
				}
			});
		},

		getDateTime: function(sDate) {
			var oDate = 'NA';

			if (sDate !== undefined && sDate !== null) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd-MMM-yyyy HH:mm"
				});

				oDate = dateFormat.format(sDate);

			}
			return oDate;
		},

		showMessageToast: function(message) {
			MessageToast.show(message, {
				my: "center center",
				at: "center center"
			});
		},

		showErrorBox: function(message) {
			MessageBox.show(message, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: this.i18n("notice"),
				actions: [sap.m.MessageBox.Action.OK]
			});
		},

		openDialog: function(settings) {
			var oDialog = new Dialog('confirmationDialog', {
				title: settings.title,
				type: 'Message',
				content: settings.content,
				beginButton: new Button({
					text: settings.submitLabel,
					press: function(oEvt) {
						settings.submitAction();
					}
				}),
				endButton: new Button({
					text: this.i18n("cancel"),
					press: function() {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

		confirmDialog: function(sMessage, fCallback) {

			var dialog = this.callBackDialog(sMessage,
				new Button({
					text: this.i18n("ok"),
					press: fCallback
				}),
				new Button({
					text: this.i18n("cancel"),
					press: function() {
						dialog.close();
					}
				}),
				fCallback
			);

			return dialog;
		},

		confirmDeleteDialog: function(sMessage, fCallback) {
			var dialog = this.callBackDialog(sMessage,
				new Button({
					text: this.i18n("delete"),
					type: sap.m.ButtonType.Reject,
					press: fCallback
				}),
				new Button({
					text: this.i18n("cancel"),
					type: sap.m.ButtonType.Emphasize,
					press: function() {
						dialog.close();
					}
				}),
				fCallback,
				"sap-icon://message-warning"
			);

			return dialog;
		},

		callBackDialog: function(sMessage, beginButton, endButton, fCallback, sIcon, state) {
			var dialog = new Dialog({
				title: this.i18n("confirm"),
				type: 'Message',
				icon: sIcon,
				state: state ? state : sap.ui.core.ValueState.None,
				content: new Text({
					text: sMessage
				}),
				beginButton: beginButton,
				endButton: endButton,
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.attachAfterOpen(function() {
				dialog.getEndButton().focus();
			});

			dialog.open();

			return dialog;
		},

		setPeriod: function(oPeriod) {
			this.getOwnerComponent().period = oPeriod;
		},

		getPeriod: function() {
			return this.getOwnerComponent().period;
		},

		toUTCDate: function(date) {
			return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
		},

		i18n: function(sKey) {
			return this.getModel("i18n").getResourceBundle().getText(sKey);
		},
		
		/** Creates a filter which searches for aSearch across multiple aKeys with an OR condition **/
		multiFilter: function(aKeys, sSearch)
		{
			var aFilters = [], i;
			
			for (i = 0; i < aKeys.length; i++) {
				aFilters.push(new sap.ui.model.Filter(
					{
						path: aKeys[i],
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sSearch
					}
				));
			}
			
			return this.orFilter(aFilters);
		},
		
		orFilter: function(aFilters) {
			return new sap.ui.model.Filter({
				filters: aFilters,
				and: false
			});
		},
		
		// Alternative to Object.values which is not supported by IE11
		objectValues: function(obj)
		{
			return Object.keys(obj).map(function(e) {
			  return obj[e];
			});
		}

	});

});