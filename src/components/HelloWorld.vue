<template>
  <div class="hello-world">
    <div class="pick-type-button">
      <div ref="cityPicker" style="position:relative;">
        <div class="initial-address">{{chooseList[0].name}}</div>
        <input type="text" id="city-picker" class="address-picker elliptical" @click="chooseList[0].name = ''">
      </div>
      <div @click="showPickList('workType')">{{ workType }}</div>
      <div @click="showPickList('issueDate')">{{ issueDate }}</div>
    </div>
    <div class="picker">
      <div class="work-type">
        <ul class="pick-list" ref="workType">
          <li @click="workTypePickHandle('不限')">
            不限<span v-show="workType == '不限'">√</span>
          </li>
          <li @click="workTypePickHandle('实习')">
            实习<span v-show="workType == '实习'">√</span>
          </li>
          <li @click="workTypePickHandle('兼职')">
            兼职<span v-show="workType == '兼职'">√</span>
          </li>
          <li @click="workTypePickHandle('全职')">
            全职<span v-show="workType == '全职'">√</span>
          </li>
        </ul>
      </div>
      <div class="issue-date">
        <ul class="pick-list" ref="issueDate">
          <li @click="issueDatePickHandle('不限')">
            不限<span v-show="issueDate == '不限'">√</span>
          </li>
          <li @click="issueDatePickHandle('3天')">
            3天<span v-show="issueDate == '3天'">√</span>
          </li>
          <li @click="issueDatePickHandle('7天')">
            7天<span v-show="issueDate == '7天'">√</span>
          </li>
          <li @click="issueDatePickHandle('14天')">
            14天<span v-show="issueDate == '14天'">√</span>
          </li>
          <li @click="issueDatePickHandle('30天')">
            30天<span v-show="issueDate == '30天'">√</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      address: '',
      hasTimer: false,
      currentPicker: 'workType',
      workType: '所有工作类型',
      issueDate: '所有发布时间',
      chooseList: [
        { id: 1, name: '所有工作地' },
        { id: 2, name: '所有工作类型' },
        { id: 3, name: '所有发布时间' }
      ]
    }
  },
  created () {
    this.$nextTick(() => {
      // eslint-disable-next-line
      $('#city-picker').cityPicker({
        title: '请选择地址',
        showDistrict: false,
        onChange: (picker, values, displayValues) => { // 选择后触发的事件
          this.address = displayValues
        }
      })
    })
  },
  methods: {
    showPickList (pickType) {
      this.$refs[this.currentPicker].style.display = 'none'
      this.$refs[pickType].style.animationName = 'wrapper-gradient'
      this.$refs[pickType].style.display = 'block'
      this.currentPicker = pickType
    },
    workTypePickHandle (value) {
      this.workType = value
      this.$refs.workType.style.animationName = 'wrapper-gradient-hide'
    },
    issueDatePickHandle (value) {
      this.issueDate = value
      this.$refs.issueDate.style.animationName = 'wrapper-gradient-hide'
    },
    showCurrentAddress () {
      // if ($('#start_place_id').val() != '') {
      //   $('#start').attr('data-code', $('#start_place_id').val());
      //   var citydatacodes = $('#start_place_id').val();
      //   var str = citydatacodes.substring(2);
      //   $('#start').attr('data-codes', citydatacodes.replace(str, '0000') + ',' + $('#start_place_id').val());
      //   //加载已认证的默认城市
      //   var cityvalue = [];
      //   var codes = $('#start').attr('data-code');   //如130100
      //   var str = codes.replace(codes.substring(2), '0000'); //如130000
      //   var raw = $.rawCitiesData;
      //   for (var i = 0; i < raw.length; i++) {
      //     if (str == raw[i].code) {
      //       cityvalue.push(raw[i].name);
      //       console.log(raw[i].name);
      //       for (var j = 0; j < raw[i].sub.length; j++) {
      //         if (raw[i].sub[j].code === codes) {
      //           console.log(raw[i].sub[j].name);
      //           cityvalue.push(raw[i].sub[j].name);
      //           console.log(cityvalue);
      //           $('#start').val(cityvalue);
      //           return;
      //           // sub(raw[i].sub[j].name);
      //         }
      //       }
      //     }
      //   }
      // }
    }
  },
  watch: {
    // eslint-disable-next-line
    address(newValue,oldValue) {
      // 如果已经有定时器了，就返回
      if (this.hasTimer) return
      // 即将开启定时器，设置定时器为hasTimer为true
      this.hasTimer = true
      // 开启定时器，每0.1秒检测picker是否关闭
      let timer = setInterval(() => {
        // eslint-disable-next-line
        let havePicker = $('.weui-picker-container').length
        // 如果picker已经关闭，则清除定时器
        if (havePicker === 0) {
          clearInterval(timer)
          // 在这里发送请求
          console.log('在这里发送请求')
        }
      }, 100)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./../assets/css/common.css";
// reset css
* {
  margin: 0;
  padding: 0;
}
/deep/.picker-items-col {
  touch-action: none;
}
ul,
li {
  list-style: none;
}

// less css
.pick-type-button {
  height: 48px;
  background: rgba(255, 255, 255, 1);
  border-top: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.work-type,
.issue-date {
  position: absolute;
  overflow: hidden;
  width: 100%;
  .pick-list {
    animation-name: initialize-wrapper;
    animation-duration: 0.6s;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
    overflow: hidden;
  }
}
.picker {
  position: relative;
  .pick-list {
    width: 100%;
    font-size: 14px;
    line-height: 40px;
    text-align: left;
    box-sizing: border-box;
    border-radius: 0 0 3px 3px;
    box-sizing: border-box;
    background-color: #fff;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid #dddddd;
    }
  }
}
.address-picker {
  width: 96px;
  height: 25px;
  border: none;
  outline: none;
  font-size: 16px;
  position: relative;
  background-color: transparent;
  z-index: 9;
}
// 单行文本溢出
.elliptical {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.initial-address {
  position: absolute;
}
</style>
