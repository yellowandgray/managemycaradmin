import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { ChatModel, ChannelModel, ContactModel, CallsModel, BookmarkModel, AttachmentModel, ChatMessage } from './chat.model';
import { messages, attachementsData, chatContactData, chatData, ChannelsData, callsData, bookmarkData } from './data';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    chatData!: ChatModel[];
    channeldata!: ChannelModel[];
    contactData!: ContactModel[];
    messageData!: ChatMessage[];

    searchText: any;
    searchMsgText: any;
    formData!: UntypedFormGroup;
    usermessage!: string;
    isFlag: boolean = false;
    submitted = false;
    isStatus = 'online';
    isProfile: string = 'assets/images/users/48/avatar-2.jpg';
    username: any = 'Lisa Parker';

    images: { src: string; thumb: string; caption: string }[] = [];
    isreplyMessage = false;
    emoji = '';
    currentTab = 'chats';
    @ViewChild('scrollRef') scrollRef: any;
    // currentTab!: string;

    constructor(public formBuilder: UntypedFormBuilder, private datePipe: DatePipe) { }

    ngOnInit(): void {
        // Chat Data Get Function
        this._fetchData();

        // Validation
        this.formData = this.formBuilder.group({
            message: ['', [Validators.required]],
        });

        this.onListScroll();
    }

    ngAfterViewInit() {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop = 300;
        this.onListScroll();
    }

    closeoffcanvas() {
        document.querySelector('.chat-detail')?.classList.remove('show')
        document.querySelector('.backdrop1')?.classList.remove('show')
    }

    openEnd() {
        document.querySelector('.chat-detail')?.classList.add('show')
        document.querySelector('.backdrop1')?.classList.add('show')
    }

    // Change Tab Content
    changeTab(tab: string) {
        this.currentTab = tab;
    }

    /**
     * 
   * Returns form
   */
    get form() {
        return this.formData.controls;
    }

    // Chat Data Fetch
    private _fetchData() {

        // Fetch Data
        setTimeout(() => {
            this.messageData = messages;
            document.getElementById('elmLoader')?.classList.add('d-none')
        }, 1200)

        this.chatData = chatData;
        this.channeldata = ChannelsData;
        this.contactData = chatContactData;

    }

    onListScroll() {
        if (this.scrollRef !== undefined) {
            setTimeout(() => {
                this.scrollRef.SimpleBar.getScrollElement().scrollTop = this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
            }, 500);
        }
    }

    /**
   * Save the message in chat
   */
    messageSave() {
        const message = this.formData.get('message')!.value;
        if (this.isreplyMessage == true) {
            var itemReplyList: any = document.getElementById("users-chat")?.querySelector(".chat-conversation-list");
            var dateTime = this.datePipe.transform(new Date(), "h:mm a");
            var chatReplyUser = (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .conversation-name") as HTMLAreaElement).innerHTML;
            var chatReplyMessage = (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .mb-0") as HTMLAreaElement).innerText;

            this.messageData.push({
                isSender: true,
                sender: 'Marcus',
                replayName: chatReplyUser,
                replaymsg: chatReplyMessage,
                message,
                createdAt: dateTime,
            });
            this.onListScroll();

            // Set Form Data Reset
            this.formData = this.formBuilder.group({
                message: null,
            });
            this.isreplyMessage = false;

        }
        else {
            if (this.formData.valid && message) {
                // Message Push in Chat
                this.messageData.push({
                    id: this.messageData.length + 1,
                    isSender: true,
                    sender: 'Marcus',
                    message,
                    createdAt: this.datePipe.transform(new Date(), "h:mm a"),
                });
                this.onListScroll();
                // Set Form Data Reset
                this.formData = this.formBuilder.group({
                    message: null,
                });
            }
        }
        document.querySelector('.replyCard')?.classList.remove('show');
        
        this.emoji = '';

        this.submitted = true;
    }

    // Emoji Picker
    showEmojiPicker = false;
    sets: any = [
        'native',
        'google',
        'twitter',
        'facebook',
        'emojione',
        'apple',
        'messenger'
    ]
    set: any = 'twitter';
    toggleEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
    }

    addEmoji(event: any) {
        const { emoji } = this;
        const text = `${emoji}${event.emoji.native}`;
        this.emoji = text;
        this.showEmojiPicker = false;
    }

    /***
    * OnClick User Chat show
    */
    chatUsername(name: string, image: any, event: any) {
        const li = document.querySelectorAll('#userList')
        li.forEach((item: any) => {
            item.classList.remove('active')
        })
        event.target.closest('li').classList.add('active')
        this.isFlag = true;
        this.username = name;
        const currentDate = new Date();
        this.isStatus = status;
        this.isProfile = image ? image : 'assets/images/users/user-dummy-img.jpg';
        // this.messageData.map((chat) => { if (chat.image) { chat.profile = this.isProfile } });
        const userChatShow = document.querySelector('.user-chat');
        if (userChatShow != null) {
            userChatShow.classList.add('user-chat-show');
        }
    }

    // Copy Message
    copyMessage(event: any) {
        navigator.clipboard.writeText(event.target.closest('.chat-list').querySelector('.ctext-content').innerHTML);
        (document.getElementById("copyClipBoard") as HTMLElement).style.display = "block";
        setTimeout(() => {
            (document.getElementById("copyClipBoard") as HTMLElement).style.display = "none";
        }, 1000);
    }

    // Delete Message
    deleteMessage(event: any) {
        event.target.closest('.chat-list').remove();
    }

    // Replay Message
    replyMessage(event: any, align: any) {
        this.isreplyMessage = true;
        document.querySelector('.replyCard')?.classList.add('show');
        var copyText = event.target.closest('.chat-list').querySelector('.ctext-content').innerHTML;
        (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .mb-0") as HTMLAreaElement).innerHTML = copyText;
        var msgOwnerName: any = event.target.closest(".chat-list").classList.contains("right") == true ? 'You' : document.querySelector('.username')?.innerHTML;
        (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .conversation-name") as HTMLAreaElement).innerHTML = msgOwnerName;
    }

    closeReplay() {
        document.querySelector('.replyCard')?.classList.remove('show');
    }

    // Delete All Message
    deleteAllMessage(event: any) {
        var allMsgDelete: any = document.getElementById('users-conversation')?.querySelectorAll('.chat-list');
        allMsgDelete.forEach((item: any) => {
            item.remove();
        })
    }

    // Contact Search
    ContactSearch() {
        var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
        input = document.getElementById("searchContact") as HTMLAreaElement;
        filter = input.value.toUpperCase();
        ul = document.querySelectorAll(".chat-user-list");
        ul.forEach((item: any) => {
            li = item.getElementsByTagName("li");
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("p")[0];
                txtValue = a?.innerText;
                if (txtValue?.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        })

    }

    // Message Search
    MessageSearch() {
        var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
        input = document.getElementById("searchMessage") as HTMLAreaElement;
        filter = input.value.toUpperCase();
        ul = document.getElementById("users-conversation");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("p")[0];
            txtValue = a?.innerText;
            if (txtValue?.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

    onFocus() {
        this.showEmojiPicker = false;
    }
    onBlur() {
    }

    /**
     * Delete Chat Contact Data 
     */
    delete(event: any) {
        event.target.closest('li')?.remove();
    }

    hideChat() {
        // const userChatShow = document.querySelector('.user-chat');
        // if (userChatShow != null) {
        //     userChatShow.classList.remove('user-chat-show');
        // }
    }


}
