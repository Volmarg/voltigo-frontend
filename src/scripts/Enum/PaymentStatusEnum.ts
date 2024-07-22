enum PAYMENT_STATUS_ENUM {
    // new transaction, nothing has been done with it yet
    PENDING,

    // transaction finished with success, tool accepted the founds, money was transferred
    SUCCESS,

    // transaction is finished with success, however the user either paid more or less than required
    SUCCESS_NOT_EQUAL_DEMANDED,

    // user finished payment on his side, the tool needs to provide response
    IN_PROGRESS,

    // something went wrong on some step
    ERROR,

    // no idea what is happening
    UNKNOWN,

    // the payment has been cancelled
    CANCELLED,

    // not really planning to support this but still adding
    RETURNED,

    // transaction process has started, this state is coming directly (AND ONLY) after status "PENDING"
    TRIGGERED,
}

export {PAYMENT_STATUS_ENUM}