
/*
    diff the dom children and rules children

    the dom vnodes will be reused with the same patchKey and the same type , 
    so , we can make the reused vnodes stay in the same index , this is the first step
    and then , the unsame keyed vnodes , we can reuse them if they have the same type , its the second step,
    apon the process , we get the same length children , 
    and the same type and same key vnodes are in the same index , the same type , not same key nodes also in the same index , 
    so the only things we need todo is loop the chidren each the patch operate,

    but the rules is something different , 
    the same nodeType and same key we can reuse ,
    others can be rsused while they have the same nodeType

    ! something interesting  , the key order will not change
*/

function diffChildren(p: any, n: any) {
    
}