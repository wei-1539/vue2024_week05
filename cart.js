// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.13/vue.esm-browser.min.js';
// 導入productModal的元件
const { createApp } = Vue
import userProductModal from './userProductModal.js'


const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'wei_rio';
// const path = 'casper-hexschool';


const app = createApp({
    data() {
        return {
            isLoading: false,
            // 存放loading『當前的狀態』
            loadingStatus: {
                // 查看更多
                loadingItem: '',
                // 加入購物車
                addCartLoading: '',
                // 單除購物車
                delCartLoading: '',
                // 調整購物車數簗
                cartQtyLoading: '',
            },
            // 存放『全部』的商品列表
            products: [],
            // 存放『單一』的商品列表
            tempProduct: {},
            // 存放購物車資料
            carts: {},
            // 表單內容
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    methods: {
        // 取得商品列表
        getProducts() {
            this.$refs.getProduct.isLoading = true;
            const api = `${url}/api/${path}/products`
            axios.get(api)
                .then(res => {
                    this.products = res.data.products
                    this.$refs.getProduct.isLoading=false;
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },
        // 取得【單一】商品資料 & 並打開 Modal
        getProduct(id) {
            const api = `${url}/api/${path}/product/${id}`
            this.loadingStatus.loadingItem = id;
            axios.get(api)
                .then(res => {
                    this.loadingStatus.loadingItem = "";
                    this.tempProduct = res.data.product;
                    // 打開細節視窗
                    this.$refs.productModal.openModal();
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },

        // 加入購物車
        addToCart(product_id, qty = 1,) {
            const order = {
                product_id,
                qty,
            };
            this.loadingStatus.addCartLoading = product_id;
            const api = `${url}/api/${path}/cart`
            axios.post(api, { data: order })
                .then(res => {
                    console.log(res)
                    this.loadingStatus.addCartLoading = "";
                    //當打開modal時加入購物車一起關閉modal
                    this.getCart();
                    this.$refs.productModal.hideModal();
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },

        // 取得購物車內容
        getCart() {
            this.isLoading = true;
            const api = `${url}/api/${path}/cart`
            axios.get(api)
                .then(res => {
                    // console.log(res.data)
                    this.carts = res.data.data;
                    this.isLoading =false;
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },
        // 調整購物車內容
        changeCartQty(item, qty = 1) {
            const order = {
                // 這裡是product 的id
                product_id: item.product_id,
                qty,
            };
            this.loadingStatus.cartQtyLoading = item.id;
            // item.id 是購物車的id選項，判斷使哪隻在修改 跟『product_id』是不一樣的
            const api = `${url}/api/${path}/cart/${item.id}`
            axios.put(api, { data: order })
                .then(res => {
                    this.getCart();
                    this.loadingStatus.cartQtyLoading = '';
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },
        removeCartItem(id) {
            this.loadingStatus.delCartLoading = id;

            const api = `${url}/api/${path}/cart/${id}`
            axios.delete(api)
                .then(res => {
                    this.getCart();
                    this.loadingStatus.delCartLoading = '';
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },
        removeCartAll() {
            this.loadingStatus.delCartLoading = 'clearAll';
            const api = `${url}/api/${path}/carts`
            axios.delete(api)
            .then(res => {
                this.getCart();
                this.loadingStatus.delCartLoading = '';
            })
            .catch(err => {
                alert(err.data.message)
            })
        },
        onSubmit() {
            console.log(this.form)
            const api = `${url}/api/${path}/order`
            axios.post(api,{data:this.form})
            .then ((res)=>{
                console.log(res)
                alert(res.data.message)
                // 清空表單內容
                this.$refs.form.resetForm();
                // 重新顯示購物車內容
                this.getCart()
            })
            .catch((err)=>{
                alert(err.data.message)
            })
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
});

app.component('loading', VueLoading.Component)
// 生成元件供畫面使用
app.component('userProductModal', userProductModal);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json');
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount('#app');