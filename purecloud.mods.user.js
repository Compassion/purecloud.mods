// ==UserScript==
// @name         PureCloud.Mods
// @namespace    https://github.com/Compassion/salesforce.mods
// @version      4
// @description  PureCloud.Mods
// @author       Mark Harvey
// @include      https://apps.mypurecloud.com.au/directory/*
// @grant        none
// @updateURL       https://github.com/Compassion/purecloud.mods/raw/master/purecloud.mods.user.js
// @downloadURL     https://github.com/Compassion/purecloud.mods/raw/master/purecloud.mods.user.js
// @updateVersion   4
// @homepageURL     https://github.com/Compassion/purecloud.mods
// @supportURL      https://github.com/Compassion/purecloud.mods/issues
// ==/UserScript==



(function() {
    'use strict';
    console.log('Loaded Compassion.PureCloud.Mods');
    waitForLoad();
})();

function waitForLoad()
{
    if($(".action-panel.acd-interactions").length == 0)
    {
      console.log('Waiting for Ember load');
      setTimeout(function(){
        waitForLoad();
      }, 500);
    }
    else
    {
        console.log('Ember Loaded starting Mutation Observer');
        startMutationObserver();
    }
}

function startMutationObserver() {
    var targetNodes         = $(".action-panel.acd-interactions");
    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
    var myObserver          = new MutationObserver (mutationHandler);
    var obsConfig           = { childList: true, characterData: false, attributes: false, subtree: true };

    targetNodes.each ( function () {
        myObserver.observe (this, obsConfig);
    });

    // Hook answer button if already exists
    $('.non-realtime-interactions').find('.btn.btn-purecloud.btn-success.answer-interaction').click(function () {
        console.log('answered!');
        setTimeout(function(){
            HideReplyPanel();
        }, 2000);
        PopCase(); 
    });
}

function mutationHandler (mutationRecords) {
    mutationRecords.forEach ( function (mutation) {
        if (typeof mutation.addedNodes == 'object') {
            var jq = $(mutation.addedNodes);
            //console.log (jq);
            if(jq.is('.non-realtime-interactions'))
            {
              console.log('Hooking answer button');
              jq.find('.btn.btn-purecloud.btn-success.answer-interaction').click(function () {
                  console.log('answered!');
                  setTimeout(function(){
                    HideReplyPanel();
                  }, 2000);
                  PopCase();
              });
            }
        }
    } );
}

function PopCase()
{
    console.log('popping case');
    var subject = $('.message-subject').first().text();
    var n = subject.indexOf('id:');
    var url = 'https://compassionau.my.salesforce.com/' + subject.substring(n+3);
    console.log('url: ' + url);
    window.open(url,'_blank');
}

function HideReplyPanel()
{
    console.log('hiding reply panel');
    $('.response-panel-preview').addClass('hide');
}
