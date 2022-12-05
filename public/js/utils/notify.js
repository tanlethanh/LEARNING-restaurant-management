class NotificationQueue {

    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
        this.intervalId = null
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;

        if (this.intervalId == null) {
            this.intervalId = setInterval(() => {
                if (this.length == 0) {
                    clearInterval(this.intervalId)
                    this.intervalId = null
                }
                else {
                    this.pushNotifyFromQueue()
                }
            }, 1000)
        }

    }

    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek() {
        return this.elements[this.head];
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    pushNotify(_status, _title, _text) {
        // console.log(_status, _title, _text)
        new Notify({
            status: _status,
            title: _title,
            text: _text,
            effect: 'slide',
            speed: 500,
            customClass: null,
            customIcon: null,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 5000,
            gap: 5,
            distance: 10,
            type: 1,
            position: 'left bottom'
        })
    }

    pushNotifyFromQueue() {
        if (!this.isEmpty) {
            const curNoti = this.dequeue()
            this.pushNotify(curNoti.status, curNoti.title, curNoti.text)
            // console.log(curNoti)

            if (curNoti.callback) {
                curNoti.callback(curNoti)
            }
            
        }
    }
}

export default new NotificationQueue()
