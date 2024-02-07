export default {
    template: '#userProductModal',
    // 需要將父層的 tempProduct、addToCart方法加入 
    props: ['productItem','addToCart'],
    data() {
        return {
            modal: '',
            // modal內的數量 預設為1
            qty:1,
        }
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
    },
    // 監聽productItem『外層』 內容有變化的時候,讓 qty（數量） 打開時數量是 1
    watch:{
        productItem(){
            this.qty=1; 
        }
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal)
    },
}