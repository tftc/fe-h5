import './index.less';

import $ from 'webpack-zepto';

var recharge = {
  //渲染充值银行
  setOverrunExplain: function(bankCode) {
    var banks = {
      "CMB": [{
        "name": "招商银行",
        "phone": "95555",
        "rows": [{
          "data": ['大众版', '5000', '5000']
        }, {
          "data": ['专业版', '无限额', '无限额']
        }]
      }],
      "ICBC": [{
        "name": "中国工商银行",
        "phone": "95588",
        "rows": [{
          "data": ['存量静态密码', '累计300', '累计300']
        }, {
          "data": ['电子银行口令卡', '500', '1000']
        }, {
          "data": ['电子银行口令卡+手机短信认证', '2000', '5000']
        }, {
          "data": ['U盾', '100万', '100万']
        }]
      }],
      "ABC": [{
        "name": "中国农业银行",
        "phone": "95599",
        "rows": [{
          "data": ['IE证书', 1000, 3000]
        }, {
          "data": ['K码', '1000', '1000']
        }, {
          "data": ['动态口令卡', 50000, 50000]
        }, {
          "data": ['K令', 100000, 500000]
        }, {
          "data": ['一代K宝', 500000, 1000000]
        }, {
          "data": ['二代K宝', 1000000, 5000000]
        }, {
          "data": ['通用K', 1000000, 5000000]
        }]
      }],
      "BOC": [{
        "name": "中国银行",
        "phone": "95566",
        "rows": [{
          "data": ['专业版', '5万', '50万']
        }, {
          "data": ['网银快付', '1000', '5000']
        }]
      }],
      "CCB": [{
        "name": "中国建设银行",
        "phone": "95533",
        "rows": [{
          "data": ['帐户支付', '1000', '1000']
        }, {
          "data": ['动态口令卡', '5000', '5000']
        }, {
          "data": ['网银盾（U宝）', '50万', '50万']
        }]
      }],
      "CIB": [{
        "name": "兴业银行",
        "phone": "95561",
        "rows": [{
          "data": ['手机验证', '自选1000/5000', '自选1000/5000']
        }, {
          "data": ['电子支付卡（e卡）', '5000', '5000']
        }, {
          "data": ['证书支付', '无限额', '无限额']
        }]
      }],
      "GDB": [{
        "name": "广东发展银行",
        "phone": "95508",
        "rows": [{
          "data": ['手机动态验证码', '3000', '3000']
        }, {
          "data": ['KEY盾', '30万', '30万']
        }]
      }],
      "CMBC": [{
        "name": "中国民生银行",
        "phone": "95568",
        "rows": [{
          "data": ['大众版', '300', '300']
        }, {
          "data": ['贵宾版数字证书', '5000', '5000']
        }, {
          "data": ['贵宾版（U宝）', '2万', '10万']
        }]
      }],
      "CEB": [{
        "name": "光大银行",
        "phone": "95595",
        "rows": [{
          "data": ['动态密码支付', '5000', '5000']
        }, {
          "data": ['阳光网盾', '20万', '50万']
        }, {
          "data": ['动态口令牌', '50万', '50万']
        }]
      }],
      "SPDB": [{
        "name": "浦发银行",
        "phone": "95528",
        "rows": [{
          "data": ['动态密码版', '5万', '20万']
        }, {
          "data": ['数字证书版 ', '10万', '20万']
        }]
      }],
      "HXB": [{
        "name": "华夏银行",
        "phone": "95577",
        "rows": [{
          "data": ['直接支付', '300', '1000']
        }, {
          "data": ['电子钱包签约 ', '5万', '10万']
        }]
      }],
      "BOCOM": [{
        "name": "交通银行",
        "phone": "95559",
        "rows": [{
          "data": ['手机注册', '5000', '5000']
        }, {
          "data": ['证书支付 ', '5万', '5万']
        }]
      }],
      "BCCB": [{
        "name": "北京银行",
        "phone": "95526",
        "rows": [{
          "data": ['普通版', '累计300', '累计300']
        }, {
          "data": ['动态密码版 ', '1万', '1万']
        }, {
          "data": ['证书版 ', '100万', '100万']
        }]
      }],
      "CITIC": [{
        "name": "中信银行",
        "phone": "95558",
        "rows": [{
          "data": ['文件证书', '1000', '5000']
        }, {
          "data": ['移动证书 ', '100万', '100万']
        }]
      }],
      "PSBC": [{
        "name": "邮政储蓄银行",
        "phone": "95580",
        "rows": [{
          "data": ['手机动态密码版', '3000', '3000']
        }]
      }],
      "HKBEA": [{
        "name": "东亚银行",
        "phone": "800-830-3811",
        "rows": [{
          "data": ['手机动态密码', '5000', '2万元']
        }, {
          "data": ['USB-KEY/USB-KEY+口令卡', '100万', '100万']
        }]
      }],
      "WZCB": [{
        "name": "温州银行",
        "phone": "96699",
        "rows": [{
          "data": ['开通大众版网银支付功能', '300', '300']
        }, {
          "data": ['开通大众版网银支付功能并办理手机验证', '800', '800']
        }, {
          "data": ['开通专业版网银支付功能', '自行设置', '自行设置']
        }]
      }],
      "SRCB": [{
        "name": "上海农商银行",
        "phone": "021-962999",
        "rows": [{
          "data": ['卡号密码支付', '2000', '5000']
        }, {
          "data": ['短信专业版支付', '1000', '5000']
        }, {
          "data": ['证书专业版支付', '50', '50']
        }, {
          "data": ['手机支付', '5000', '5000']
        }]
      }]
    };
    var $tbody = $('#overrunExplain');
    $tbody.empty();
    if (typeof(banks[bankCode]) == "undefined") {
      return false;
    }
    var rowData = banks[bankCode][0];
    var name = rowData.name;
    var phone = rowData.phone;
    var rows = rowData.rows;
    var tbody = '<p class="touziall"><span class="pull-right"><b>' + name + '</b>客服热线：<b>' + phone + '</b></span>请关注您的充值金额是否超限：</p>';
    tbody += '<table class="table table-bordered overrun-table"><thead><tr><th>卡种</th><th>支付方式</th><th>单笔限额(元)</th><th>每日限额(元)</th></tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
      if (i == 0) {
        tbody += '<tr><td rowspan="' + rows.length + '">借记卡</td>';
      } else {
        tbody += '<tr>';
      }
      var data = rows[i].data;
      for (var j = 0; j < data.length; j++) {
        var val = data[j];
        if (i == 0 && j == data.length) {
          tbody += '<td rowspan="2">' + val + '</td>';
        } else {
          tbody += '<td>' + val + '</td>';
        }
      }
      tbody += '</tr>';
    }
    tbody += '</tbody></table>';
    $tbody.append(tbody);
  },
  bindEvent: function() {
    var that = this;
    $(".bank_charge").click(function(){
      var key = $(this).attr('key');
      $(".bank_charge").removeClass("active_bank");
      $(this).addClass("active_bank");
      that.setOverrunExplain(key);
    });
    $(".list_chr li").click(function(){
      $(".bank_charge").removeClass("active_bank");
      $(".list_chr li").removeClass("active");
      $(this).addClass("active");
      $(".banks_charge").hide();
      $(".banks_charge").eq($(this).index()).show();
      //rechargeType = $(this).attr("key-value");
    });
    $(".btn-primary-recharge").click(function(){
      ///payment/netSave
      if(!$(".form-control").val().trim()){
        alert("请输入充值金额");
        return false;
      }else{
        var val = $(".form-control").val().trim();
        if(isNaN(val)){
           alert("请输入数字");
           return false;
        }else{
          if(val<=0){
            alert("数字必须大于0");
            return false;
          }
        }
      }
      if($(".active_bank").length==0){
        alert("请选择银行");
        return false;
      }
      $("#bank1").val($(".form-group .active_bank").attr("key"));
      $("#recharge1").val($("#money").val());

      $(".qidai_mask_index,.qidai_mask_co").show();
    });
    //关闭弹框
    $(".qidai_mask_co .tit_r").click(function(){
      $(".qidai_mask_index,.qidai_mask_co").hide();
    });
  },
  init: function() {
    this.bindEvent();
  }
};

recharge.init();