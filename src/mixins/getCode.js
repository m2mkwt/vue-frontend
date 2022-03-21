import axios from 'axios'

export const getCommonCode = {
  data () {
    return {
      codeData: []
    }
  },
  methods: {
    getCode: function (groupCode) {
      // var abc
      axios.get('/selectCode', {
        params: { groupCode: groupCode }
      })
        .then(res => {
          if (res.status === 200) {
            // console.log(res.data.data)
            // this.codeData = res.data.data
            this.codeData.concat(res.data.data)
            // console.log(this.codeData)
            // console.log(this.codeData)
            // abc = res.data.data
            // console.log(abc)
            // return abc
            // console.log(res.data.data)
            // return code
            // DB에서 코드 읽어와서 넣기
            // const groupCode = res.data.data.map(a => a.scode)
            // const groupNm = res.data.data.map(a => a.scodeNm)
            // this.proceeds.push(...res.data.data)
            // console.log('그룹코드: ' + groupCode + ', 그룹명: ' + groupNm)
            // console.log(res.data.data)
          }
        })
      // return this.codeData
    }
  }
}
