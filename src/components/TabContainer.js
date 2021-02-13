export const role = 'tablist';

export default (dc, config) => {
  const type = config.typeTabContainer;
  const classKey = config.classTabContainer;
  const selectorTab = config.selectorTab;
  const typeTabs = config.typeTabs;

  dc.addType(type, {
    model: {
      defaults: {
        name: 'Tab Container',
        draggable: `[data-gjs-type="${typeTabs}"]`,
        droppable: `[data-gjs-type="${config.typeTab}"]`,
        copyable: false,
        removable: false,
        attributes: { role },
        ...config.tabContainerProps
      },

      init() {
        classKey && this.addClass(classKey);
        const tabs = this.components();
        // this.listenTo(tabs, 'add', this.onAdd);
        // this.listenTo(tabs, 'remove', this.onRemove);
      },

      onRemove(model, value, opts = {}) {
        const tabContent = model.tabContent;

        // I'll remove the tabContent only if I'm sure that tab is
        // removed from the collection
        tabContent && setTimeout(() => {
          const coll = model.collection;
          const tabColl = tabContent.collection;
          !coll && tabColl && tabColl.remove(tabContent);
        }, 0);
      },

      onAdd(model, value, opts = {}) {
        const attrs = model.getAttributes();

        if (!model.tabContent && !opts.avoidStore) {
          const selCont = attrs[selectorTab];
          const modelTabs = this.closestType(typeTabs);
          const tabContEl = selCont && modelTabs.view.$el.find(selCont);

          // If the tab content was found I'll attach it to the tab model
          // otherwise I'll create e new one
          if (tabContEl && tabContEl.length) {
            model.tabContent = tabContEl.data('model');
          } else {
            const tabContent = modelTabs.components().add({
              type: config.typeTabContent,
              components: config.templateTabContent,
            });
            const id = tabContent.getId();
            tabContent.addAttributes({ id });
            model.addAttributes({ [selectorTab]: `#${id}` });
            model.tabContent = tabContent;
            tabContent.getEl().style.display = 'none';
          }
        }
      }
    },
  });
}
