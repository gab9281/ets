# Example de Quiz

```gift
//-----------------------------------------//
// Examples from gift/format.php.
//-----------------------------------------//

Who's buried in Grant's tomb?{~Grant ~Jefferson =no one}

Grant is {~buried =entombed ~living} in Grant's tomb.

Grant is buried in Grant's tomb.{FALSE}

Who's buried in Grant's tomb?{=no one =nobody}

When was Ulysses S. Grant born?{#1822:5}

Match the following countries with their corresponding capitals. {
    =Canada -> Ottawa
    =Italy  -> Rome
    =Japan  -> Tokyo
    =India  -> New Delhi
    ####It's good to know the capitals
}

//-----------------------------------------//
// More complicated examples.
//-----------------------------------------//

::Grant's Tomb::Grant is {
        ~buried#No one is buried there.
        =entombed#Right answer!
        ~living#We hope not!
} in Grant's tomb.

Difficult multiple choice question.{
        ~wrong answer           #comment on wrong answer
        ~%50%half credit answer #comment on answer
        =full credit answer     #well done!}

::Jesus' hometown (Short answer ex.):: Jesus Christ was from {
        =Nazareth#Yes! That's right!
        =%75%Nazereth#Right, but misspelled.
        =%25%Bethlehem#He was born here, but not raised here.
}.

//this comment will be ignored by the filter
::Numerical example::
When was Ulysses S. Grant born? {#
        =1822:0      #Correct! 100% credit
        =%50%1822:2  #He was born in 1822.
                    You get 50% credit for being close.
}
```