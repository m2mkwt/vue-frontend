export default {
  methods: {
    calculationDate: function (anchorDate) {
      // alert(anchorDate)
      const currentWeekDay = anchorDate.getDay()
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1
      const wkStart = new Date(new Date(anchorDate).setDate(anchorDate.getDate() - lessDays))
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 4))
      const nwStart = new Date(new Date(wkStart).setDate(wkStart.getDate() + 7))
      const nwEnd = new Date(new Date(nwStart).setDate(nwStart.getDate() + 4))
      const nwStartText = nwStart.toISOString().substr(0, 10).replace('-', '.').replace('-', '.')
      const nwEndText = nwEnd.toISOString().substr(0, 10).replace('-', '.').replace('-', '.')

      return { wkStart: wkStart, wkEnd: wkEnd, nwStart: nwStart, nwStartText: nwStartText, nwEndText: nwEndText }
    }
  }
}
