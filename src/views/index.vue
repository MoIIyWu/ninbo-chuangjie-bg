<template>
  <div class="app-container home">
    <div class="dashboard-container">
      <!-- 头部内容 -->
      <el-card class="header-card">
        <div>
          <div class="fl headL">
            <div class="headImg">
              <img :src="avatar">
            </div>
            <div class="headInfoTip">
              <p class="firstChild">{{ greet() }}，{{ name }}，祝你开心每一天！</p>
            </div>
          </div>
          <div class="fr"/>
        </div>
      </el-card>
      <!-- 主要内容 -->
      <el-row type="flex" justify="space-between">
        <!-- 左侧内容 -->
        <el-col style="padding-right:26px">
          <!-- 工作日历 -->
          <el-card class="box-card">
            <div slot="header" class="header">
              <span>工作日历</span>
            </div>
            <!-- 放置日历组件 -->
            <workCalendar/>
          </el-card>

        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import workCalendar from '@/views/components/PageTools/work-calendar.vue'
import {mapGetters} from 'vuex'

export default {
  name: "Index",
  components: {
    workCalendar,
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  data() {
    return {
      // 版本号
      version: "3.8.5"
    };
  },
  methods: {
    greet() {
      const nowHours = new Date().getHours()
      if (nowHours >= 6 && nowHours < 10) {
        return '早上好'
      } else if (nowHours >= 10 && nowHours < 12) {
        return '中午好'
      } else if (nowHours >= 12 && nowHours < 17) {
        return '下午好'
      } else if (nowHours >= 17 && nowHours <= 20) {
        return '傍晚好'
      } else {
        return '晚上好'
      }
    }
  },
  goTarget(href) {
    window.open(href, "_blank");
  }

}
;
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;

  li {
    list-style: none;
  }

  .headImg {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #999;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .headInfoTip {
    padding: 25px 0 0;
    margin-left: 120px;

    p {
      padding: 0 0 15px;
      margin: 0;

      &.firstChild {
        font-size: 24px;
      }

      &.lastChild {
        font-size: 20px;
        color: #7f8c8d;
      }
    }
  }
}

.box-card {
  padding: 5px 10px;
  margin: 20px auto;

  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }

    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }

  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
}

.header-card {
  position: relative;

  .header {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
}

.advContent {
  background: #fff;
  border-radius: 5px 5px 0px 0px;

  .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }

  .contentItem {
    padding: 0 30px;
    min-height: 350px;

    .item {
      display: flex;
      padding: 18px 0 10px;
      border-bottom: solid 1px #ccc;

      .col {
        color: #8a97f8;
      }

      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 10px;
      }

      p {
        padding: 0 0 8px;
      }
    }
  }
}

.noticeList {
  margin: 0;
  padding: 0;
}

.sideNav,
.sideLink {
  padding: 30px 0 12px;

  .sideBtn {
    padding: 16px 26px;
    font-size: 16px;
    margin: 10px 5px;
  }
}

.sideLink {
  text-align: center;

  .icon {
    display: inline-block;
    width: 76px;
    height: 76px;
    //background: url('./../../assets/common/icon.png') no-repeat;
  }

  .iconGuide {
    background-position: 0 0;
  }

  .iconHelp {
    background-position: -224px 0;
  }

  .iconTechnology {
    background-position: -460px 0;
  }
}
</style>

