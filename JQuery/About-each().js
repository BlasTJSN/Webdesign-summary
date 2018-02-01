// each()函数实现原理的分析
// 最近在了解回调函数机制时，发现了一个很有趣的函数each()
// each()作为由Query封装的函数，其主要作用时对数组的循环遍历及操作，区别于javascript中的for循环
// 为什么each()会有这种用法呢，我们可以通过查看源代码来一步一步分析

// 在分析each()实现原理前首先要了解回调函数及apply()和call()方法的作用

// 在JS中一个函数中的参数是一个函数，那么这个作为参数的函数就是回调函数，回调函数可以实现程序异步执行
// 回调不会立即执行，会等待一个条件，满足条件后执行 例如在ajax中回调函数会在获取数据后调用（获取成功执行success,获取失败执行fail）

// call()和apply()都是可以用来代替另一个对象调用一个方法

func.call(obj,arg1，arg2,arg3,…)
// obj表示当前对象， arg1,arg2,…传入的参数，可为数组
// 作用是把当前的对象obj变为指定的对象func(一般为函数名) ---网上说法是将一个对象的上下文从原来的上下文变为指定的上下文。
// 如果不提供参数obj，Global对象将被作用于obj
//如果func为函数，可以简单粗暴的理解为给func传入新的参数arg1,arg2，然后执行func

func.apply(obj,args) 
// 作用和call()一样
// 区别在于传入的参数，但是apply只接受两个参数，第一个参数obj是一样的,第二个参数args是一个数组或非数组


// 然后我们根据Jq提供的each()函数源代码来分析 jquery 1.7.2.js 版本，
// 虽然新版本已经简化了each()代码，但我们的主要目的是理解apply()和call()的用法，所以选择了此版本来分析。


// args is for internal usage only args  callback的参数args,可理解为如果传入了args，则返回args作为callback的参数
	// each(obj,callback,args),参数obj是指定的对象，一般为数组（可迭代的对象）,参数callback是回调函数，一般为匿名函数function(){},args为callback的参数，一般为数组
	// 注意如果传入了args参数，那么callback参数的长度要和args长度保持一致，否则会有缺失的参数
  
	each: function( obj, callback, args ) {
		// 变量的定义
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );
      
		// 先判断是否传入参数args
		if ( args ) {
			// 如果传入参数args
			// 判断参数obj对象是否为数组
			if ( isArray ) {
				// 为数组则进行for循环遍历
				for ( ; i < length; i++ ) {
					// 调用apply()函数，每进行一次循环，就把args作为参数传给callback
					// obj[i]指本次循环的对象this，callback代替了obj[i]
					// value是对象属性名，在开头已经声明了
					value = callback.apply( obj[ i ], args );
					
					// 如果没有函数执行，结束循环
					if ( value === false ) {
						break;
					}
				}
			} else {
				// 如果不是数组
				for ( i in obj ) {
					// 调用apply()函数，把args作为参数传给callback，callback代替了obj
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			// 如果没有传入参数args
			// 判断obj是否为数组
			if ( isArray ) {
				// 如果是数组
				for ( ; i < length; i++ ) {
					// 调用apply()函数，每进行一次循环，就把i和obj[i]作为参数传给callback
					//  obj[i]指本次循环的对象this，callback代替了obj[i]
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				// 如果不是数组
				for ( i in obj ) {
					// 调用apply()函数，把i(i==0)和obj作为参数传给callback，callback代替了obj
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}
		// 返回对象obj
		return obj;
	},

// 经过分析，大家应该对each()函数有了更深的理解了吧
// 可以由源代码总结出each(obj,callback,args)功能
// each()如果没有传入参数args,那么callback中传入的参数是obj数组的下标及对应元素两个参数
// 如果传入参数args,那么cllback中传入的参数是args数组的每个元素，参数个数同args元素个数
// 最一般情况是$.each(arrays, function(i,array){
	// i是元组arrays的每个元素的下标，array是对应下标的元素
})
// 这也是最常用的方法



// 不过在jquery 1.12.4.js版本的JQ中，each()函数已经被简化了
// 因为args不常用，去掉了callback参数args的传入，简化了代码
each: function( obj, callback ) {
        var length, i = 0;
 
        if ( isArrayLike( obj ) ) {
            length = obj.length;
            for ( ; i < length; i++ ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        }
 
        return obj;
    },
