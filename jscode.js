;(function (MODULE , $) {
  'use strict';

    MODULE.Abstract = (function(){

        function Abstract() {
            this.settings = arguments[0] || {};
        };

        Abstract.prototype = function() {

        var callBack = function(cbFunc , params , scope) {
                if(typeof cbFunc == "function"){
                    cbFunc.apply(scope , [params]);
                }else{
                    error('not valid function or function does not exist');
                }
            },

            error = function(msg) {
                throw new Error(msg);
            },

            getCurrentTarget = function(e){
                return {
                    target : $(e.currentTarget),
                    index : $(e.currentTarget).index(),
                    text : $(e.currentTarget).html()
                };
            };

            return {
                callBack : callBack,
                error : error,
                getCurrentTarget : getCurrentTarget
            };

        }();

        return Abstract;

    })();

    MODULE.TableSelector = (function(){

        // cunstructor function
        function TableSelector() {
            // cache the jquery selector , so that can access the variable accorss the comp
            this.$ele = $(arguments[0]);
            this.config = $.extend($.fn.tableSelector.defaults , arguments[1] , {$ele : this.$ele});
            this.abstract = new MODULE.Abstract(this.config);
        };

        TableSelector.prototype = function() {

        var init = function() {
                addEvents.call(this);
            },

            // register all the events in this function so that easiar to maintain the code
            addEvents = function() {

                // Event Listeners for the cell -  click , mouseenter , mouseleave
                this.$ele.on(
                    {
                        click : $.proxy(onCellSelect,this) ,
                        mouseenter : $.proxy( function(e) {
                            $(e.currentTarget).css(
                                {
                                    'background-color' : this.config.selectedColor,
                                    'cursor': 'pointer'
                                });
                        } , this),
                        mouseleave : $.proxy ( function(e) {
                            $(e.currentTarget).css('background-color' , '');
                        } , this)
                    } , 'td' );

                // Event Listener for the button Total
                this.$ele.on( /* write own hadler */)
            },

            onCellSelect = function(e) {
                e.preventDefault();
                // always declare variable at the top of the function - check varaible hoisting concept
                var $this = this.abstract.getCurrentTarget(e).target;
                var colIndex = $this.index();
                var rowIndex = $this.closest("tr").index();

                // call callback function
                this.abstract.callBack(
                    this.config.afterSelect ,
                    {
                        val : $this.text() ,
                        colNum  : (colIndex + 1) , // add +1 , since index function gives 0-based index number
                        rowNum :  (rowIndex + 1)
                    } ,
                    this);
                e.stopPropagation();
            };

            // adding visibility - reveal or give public access to methods that we need to invoke
            return {
                init : init
            }

        }();

        $.fn.tableSelector = function(options) {
            this.each(function(){
                new TableSelector(this,options).init();
            });
        };

        $.fn.tableSelector.defaults = {
            selectedColor : "black",
            afterSelect : null
        };

        return TableSelector;
    })();

})(window.MODULE = window.MODULE || {} , jQuery);


$(document).ready(function(){
   /* table selector */
    $('.tableselector').tableSelector(
        {
            selectedColor : "red",
            afterSelect : function (Obj) {
                // check the context here
                console.log(this);
                alert("Selected val is :" + Obj.val + "\n Row Number :" + Obj.rowNum + "\n Column Number:" + Obj.colNum);
            }
        }
    );
});


/*
    we can also call the comp using below instead of jquery function
    if use below we can avoid adding function into jQuery name space

options = {
            selectedColor : "red",
            afterSelect : function (Obj) {
                // check the context here
                console.log(this);
                alert("Selected val is :" + Obj.val + "\n Row Number :" + Obj.rowNum + "\n Column Number:" + Obj.colNum);
            }
        }

new MODULE.TableSelector('#tableselector', options ).init();

*/
