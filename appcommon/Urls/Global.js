
class Global {

    static PROD_VAR = true;

    static BASE_PATH = Global.PROD_VAR ? 'https://www.bringmyfood.in' : 'http://192.168.31.60';

    static VERSION_CHECK_URL = '/data/reactapp/userapp/get-current-version-number.php';

    static FETCH_DISHES_LIST = '/data/reactapp/restaurant/get-restaurant-products.php';

    static CHANGE_DISH_STATUS_URL = '/data/reactapp/restaurant/change-restaurant-product-status.php';

    static GET_RESTAURANT_ORDERS_MIN = '/data/reactapp/restaurant/get-restaurant-orders-min.php';

    static RESTAURANT_LOGIN_URL = '/data/reactapp/restaurant/restaurant-login.php';

    static GET_ORDER_DETAILS = '/data/reactapp/restaurant/get-order-details.php';

    static GET_RESTAURANT_ORDERS = '/data/reactapp/restaurant/get-restaurant-orders.php';

    static ACCEPT_RESTAURANT_ORDERS = '/data/reactapp/restaurant/accept-restaurant-order.php';

    static GET_DELIVERED_ORDERS = '/data/reactapp/restaurant/get-delivered-orders.php';

    static CHANGE_RESTAURANT_SERVING_STATUS_URL = '/data/reactapp/restaurant/change-restaurant-serving-status.php';

    static START_ORDER_COOKING_URL = '/data/reactapp/restaurant/start-cooking-order.php';

    static RESTAURANT_ORDER_ACTION_URL = '/data/reactapp/restaurant/restaurant-order-action.php';

    static HANDOVER_ORDER_URL = '/data/reactapp/restaurant/hand-over-order.php';
}

export default Global;

