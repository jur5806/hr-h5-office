import Vue from 'vue'

/**
 * 转换前先替换为 IE 可识别的格式
 * @param time
 * @returns {string}
 */
const replaceTime = (time) => {
  return typeof time === 'string' ? time.replace(/-/g, '/') : time
}

 //项目领域：1电子信息、2先进制造、3航天航空、4现代交通、5生物医药与医药器械、6新材料、7新能源与节能、8环境保护、9地球空间与海洋、10核应用技术、11现代农业、12文化创意、13其他
Vue.filter('domain', (value) => {//经营范围
  switch (value) {
    case null:
    case undefined:
    case '':
      return '-';
    case 1:
      return '数字经济';
    case 2:
      return '半导体';
    case 3:
      return '先进制造';
    case 4:
      return '新材料';
    case 5:
      return '新能源及节能环保';
    case 6:
      return '生命健康';
    case 7:
      return '军民融合';
    case 8:
      return '科技服务业';
    case 9:
      return '文化创意';
    case 10:
      return '院所中心';
    case 11:
      return '其他';
  }
});

Vue.filter('coreTeamPersonJob', (val) => {
  switch (val) {
    case null:
    case undefined:
    case '':
      return '-';
    case 1:
      return '员工';
    case 2:
      return '股东';
    case 3:
      return '法人';
  }
});

Vue.filter('coreTeamPersonIntroduction', (val) => {
  switch (val) {
    case null:
    case undefined:
    case '':
      return '-';
    case 1:
      return '引进';
    case 2:
      return '培育';
  }
});

Vue.filter('education', (val) => {
  switch (val) {
    case null:
    case undefined:
    case '':
      return '-';
    case 1:
      return '本科';
    case 2:
      return '硕士研究生';
    case 3:
      return '博士研究生';
    case 4:
      return '博士后';
    case 5:
      return '其他';
  }
});

Vue.filter('property', (val) => {
  switch (val) {
    case null:
    case undefined:
    case '':
      return '-';
    case 1:
      return '发明专利';
    case 2:
      return '实用新型';
    case 3:
      return '外观设计';
    case 4:
      return '商品商标';
    case 5:
      return '服务商标';
    case 6:
      return '集体商标';
    case 7:
      return '证明商标';
    case 8:
      return '软件著作权';
    case 9:
      return '其它';
  }
});

Vue.filter('fileManageType', (val) => {
  switch (val) {
    case 1:
      return '合同资料'
    case 2:
      return '证件资料'
    case 3:
      return '流程表资料'
    case 4:
      return '人才资料'
    case 5:
      return '知识产权资料'
    case 6:
      return '其他资料'
    default:
      return val
  }
})
Vue.filter('status', (val) => {
  switch (val) {
    case 0:
      return '待审批'
    case 1:
      return '通过'
    case 2:
      return '驳回'
    default:
      return val
  }
})
Vue.filter('coreTeamPersonProfessional', (val) => {
  switch (val) {
    case 1:
      return '初级'
    case 2:
      return '中级'
    case 3:
      return '高级'
    case 4:
      return '海外'
    case 5:
      return '其他'
    default:
      return val
  }
})

Vue.filter('coreTeamPersonHighestHonor', function (val) {
  switch (val) {
    case 1:
      return '区级'
    case 2:
      return '市级'
    case 3:
      return '省级'
    case 4:
      return '国家级'
    case 5:
      return '海外'
    case 6:
      return '其他'
  }
})

Vue.filter('empty', (val) => {
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      return val
  }
})

Vue.filter('date', (val) => {
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      return new Date(val).format('yyyy-MM-dd')
  }
})
Vue.filter('increasingType', (val) => {
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    case 1:
    case '1':
      return '%'
    case 2:
    case '2':
      return '元'
    default:
      return val
  }
})

Vue.filter('date', (val) => {
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      return new Date(replaceTime(val)).format('yyyy-MM-dd')
  }
})

Vue.filter('date2', (val) => {
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      return new Date(replaceTime(val)).format('yyyy/MM/dd')
  }
})

Vue.filter('datetime', (val) => {
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      return new Date(replaceTime(val)).format('yyyy-MM-dd hh:mm:ss')
  }
})

Vue.filter('datetimeType', (val, type) => {//自定义 date、datetime格式显示
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      return new Date(replaceTime(val)).format(type)
  }
})

Vue.filter('vSlice', (val, start, end) => {//截取数字
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      if (start && end) {
        return val.slice(start, end)
      } else if (start) {
        return val.slice(start)
      } else if (end) {
        return val.slice(end)
      } else {
        return val.slice(start, end)
      }
  }
})

Vue.filter('osStatus', function (val) { // 工单状态
  switch (val) {
    case 1:
      return '待处理'
    case 2:
      return '处理中'
    case 3:
      return '待确认'
    case 4:
      return '已完成'
    default:
      return val
  }
})

Vue.filter('odStatus', function (val) { // 工单详情状态
  switch (val) {
    case 1:
      return '服务工单已派发给您'
    case 2:
      return '工单处理中'
    case 3:
      return '工单待确认'
    case 4:
      return '工单已处理完成'
    default:
      return val
  }
})

Vue.filter('odPriority', function (val) { // 工单优先级
  switch (val) {
    case 1:
      return '低'
    case 2:
      return '中'
    case 3:
      return '高'
    case 4:
      return '紧急'
    case 5:
      return '非常紧急'
    default:
      return val
  }
})

Vue.filter('osOrigin', function (val) { // 信息来源（1微信提交 ，2后台添加）
  switch (val) {
    case 1:
      return '微信提交'
    case 2:
      return '后台添加'
    default:
      return val
  }
})
Vue.filter('digit', function (val, type) { // 货币截取位数
  let str = val ? typeof val === 'string' ? val : val.toFixed(2) : '0.00'
  switch (val) {
    case null:
    case 'null':
    case undefined:
    case 'undefined':
    case '':
      return '-'
    default:
      if (type === 1) {
        return str.split('.')[0]
      } else if (type === 2) {
        return str.split('.')[1]
      }
      return str
  }
})

/**
 * 静态数据
 */
Vue.prototype.J_dataOptions = {
  colorList: ['#ff0000', '#ff9957', '#ffc600', '#6bd799', '#00c3e6', '#67affb', '#8690ff', '#bbbbbb', '#ff6e96', '#1d1d1d'],
  activityColor: ['#b178ff', '#b178ff', '#FF8C3F', '#3F7AFF', '#91A1B9'],/*（1未开始2预热中3报名中4进行中5已结束）*/
  policyColor: ['#6bd799', '#67affb', '#ff9957', '#8690ff']/*(1人才政策(绿色)2科技政策(蓝色)3经济政策(橙色)4创新政策(紫色))*/
}

Vue.filter('fieldFeeUnit', function (val) { // 场地预约 单位 fieldFeeUnit（1元/半小时2元/次）
  switch (val) {
    case 1:
      return '元/半小时'
    case 2:
      return '元/次'
    default:
      return val
  }
})
