import { ArrayDropdown, Calendar, MdsTableAction, SearchMultipleModel } from "./generic-table-action.model"

describe("GenericTableActionModel", () => {

  it("should create MdsTableAction object correctly", () => {
    const obj: MdsTableAction = {
      type: "start",
      mini: true,
      callback: "viewProcess",
    }
    const mdsTableAction1 = new MdsTableAction()
    const mdsTableAction2 = new MdsTableAction(obj)

    expect(mdsTableAction1).toBeTruthy()
    expect(mdsTableAction2).toBeTruthy()

    expect(mdsTableAction1.type).toBeUndefined()
    expect(mdsTableAction2.type).not.toBeUndefined()
    expect(mdsTableAction2.type).toBe(obj.type)
    expect(mdsTableAction2).toEqual(obj)
  })

  it("should create SearchMultipleModel object correctly", () => {
    const obj: SearchMultipleModel = {
      label: "Nom",
      name: "nom",
      type: "input",
      selected: false,
    }
    const searchMultipleModel1 = new SearchMultipleModel()
    const searchMultipleModel2 = new SearchMultipleModel(obj)

    expect(searchMultipleModel1).toBeTruthy()
    expect(searchMultipleModel2).toBeTruthy()

    expect(searchMultipleModel1.type).toBeUndefined()
    expect(searchMultipleModel2.type).not.toBeUndefined()

    expect(searchMultipleModel2).toEqual(obj)
    expect(searchMultipleModel2.selected).toBe(obj.selected)


  })

  it("should create ArrayDropdown object correctly", () => {
    const obj: ArrayDropdown = {
      name: "Trimestre 1",
      value: "Trimestre 1",
    }

    const arrayDropdown1 = new ArrayDropdown()
    const arrayDropdown2 = new ArrayDropdown(obj)

    expect(arrayDropdown1).toBeTruthy()
    expect(arrayDropdown2).toBeTruthy()

    expect(arrayDropdown1.name).toBeUndefined()
    expect(arrayDropdown2.name).not.toBeUndefined()

    expect(arrayDropdown2.name).toBe(obj.name)
    expect(arrayDropdown2).toEqual(obj)


  })

  it("should create Calendar object correctly", () => {
    const obj: Calendar = {
      date: new Date(),
      view: "month",
      dateFormat: "mm/yy",
    }

    const calendar1 = new Calendar()
    const calendar2 = new Calendar(obj)

    expect(calendar1).toBeTruthy()
    expect(calendar1).toBeTruthy()

    expect(calendar1.date).toBeUndefined()
    expect(calendar2.date).not.toBeUndefined()

    expect(calendar2).toEqual(obj)
    expect(calendar2.date).toEqual(obj.date)

  })

})