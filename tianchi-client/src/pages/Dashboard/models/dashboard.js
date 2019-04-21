import { getCostSummary, getKaoqinSummary, getStudentSummary } from '@/services/api';
import {
  CLASS_CAMPUS_CHOICE,
  EVENT_TYPE_ALIAS,
  GRADE_ALIAS,
  POLICY_TYPE_ALIAS,
  SEX_FULL_MAP,
  STAY_ALIAS
} from "@/constants";

export default {
  namespace: 'dashboard',

  state: {
    campusData: [],
    totalStudentCount: 0,
    stayData: [],
    totalStayCount: 0,
    gradeData: [],
    nationData: [],
    nativePlaceData: [],
    policyData: [],
    yearCostData: [],
    totalYearCost: 0,
    kaoqinSummaryData: [],
    totalKaoqinCount: 0,
  },

  effects: {
    * fetchCampusSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'campus'
      });
      yield put({
        type: 'saveCampusData',
        payload: response,
      });
    },
    * fetchKaoqinSummary({ payload }, { call, put }) {
      const response = yield call(getKaoqinSummary, {
        base: 'year',
        ...payload,
      });
      yield put({
        type: 'saveKaoqinSummaryData',
        payload: response,
      });
    },
    * fetchYearCostSummary({ payload }, { call, put }) {
      const response = yield call(getCostSummary, {
        base: 'year',
        ...payload,
      });
      yield put({
        type: 'saveYearCost',
        payload: response,
      });
    },
    * fetchStaySummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'stay_school'
      });
      yield put({
        type: 'saveSatyData',
        payload: response,
      });
    },
    * fetchGradeSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'grade'
      });
      yield put({
        type: 'saveGradeData',
        payload: response,
      });
    },
    * fetchNationSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'nation'
      });
      yield put({
        type: 'saveNationData',
        payload: response
      });
    },
    * fetchPolicySummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'policy'
      });
      yield put({
        type: 'savePolicyData',
        payload: response
      });
    },
    * fetchNativePlaceSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'native_place'
      });
      yield put({
        type: 'saveNativePlaceData',
        payload: response
      });
    },
  },

  reducers: {
    saveCampusData(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalStudentCount = 0;
      return {
        ...state,
        campusData: payload.map(data => {
          totalStudentCount += data.count;
          return {
            campus: CLASS_CAMPUS_CHOICE[data.stu_class__campus_name],
            count: data.count
          };
        }),
        totalStudentCount
      };
    },
    saveYearCost(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalYearCost = 0;
      return {
        ...state,
        yearCostData: payload.map(data => {
          totalYearCost += data.total_cost;
          return {
            x: data.date,
            y: Number(data.total_cost.toFixed(2))
          };
        }),
        totalYearCost: Number(totalYearCost.toFixed(2)),
      };
    },
    saveKaoqinSummaryData(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalKaoqinCount = 0;
      return {
        ...state,
        kaoqinSummaryData: payload.map(data => {
          totalKaoqinCount += data.count;
          return {
            x: EVENT_TYPE_ALIAS[data.event__type_id],
            y: data.count
          };
        }),
        totalKaoqinCount: totalKaoqinCount,
      };
    },
    saveSatyData(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalStayCount = 0;
      return {
        ...state,
        stayData: payload.map(data => {
          if (data.student__is_stay_school) {
            totalStayCount += data.count;
          }
          return {
            type: STAY_ALIAS[Number(data.student__is_stay_school)],
            name: `${STAY_ALIAS[Number(data.student__is_stay_school)]}${SEX_FULL_MAP[data.student__sex]}`,
            value: data.count,
          };
        }),
        totalStayCount
      };
    },
    saveGradeData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        gradeData: payload.map(data => {
          return {
            type: GRADE_ALIAS[data.stu_class__grade_name],
            name: `${GRADE_ALIAS[data.stu_class__grade_name]}${SEX_FULL_MAP[data.student__sex]}`,
            value: data.count,
          };
        })
      };
    },
    saveNationData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        nationData: payload.map(data => {
          return {
            x: data.student__nation,
            y: data.count,
          };
        })
      };
    },
    savePolicyData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        policyData: payload.map(data => {
          return {
            x: POLICY_TYPE_ALIAS[data.student__policy],
            y: data.count,
          };
        })
      };
    },
    saveNativePlaceData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        nativePlaceData: payload.map(data => {
          return {
            x: data.student__native_place,
            y: data.count,
          };
        })
      };
    },
    clear() {
      return {};
    },
  },
};
