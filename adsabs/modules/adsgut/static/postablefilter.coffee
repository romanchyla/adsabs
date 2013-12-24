root = exports ? this
$=jQuery
#console.log "In Funcs"
h = teacup
#redo this to use url parsing library, handle other types of queries besides tags
parse_querystring= (qstr) ->
    #console.log "QQQ", qstr
    qlist=qstr.split('&')
    qlist = _.difference(qlist,['query=tagtype:ads/tagtype:tag'])
    qlist = (q.replace('query=tagname:','') for q in qlist)
    if qlist.length==1 and qlist[0]==""
        qlist=[]
    #console.log "QLIST", qlist
    return qlist


do_postable_info = (sections, config, ptype) ->
    $.get config.infoURL, (data) ->
        if ptype=='library'
            content=views.library_info data, templates.library_itemsinfo
        else if ptype=='group'
            content=views.group_info data, templates.group_itemsinfo
        
        sections.$info.append(content+'<hr/>')
        sections.$info.show()

do_postable_filter = (sections, config) ->
    #console.log "CONFIG", config
    $.get config.tagsPURL, (data) ->
        for own k,v of data.tags
            format_tags(k, sections.$tagssec, get_tags(v, config.tqtype), config.tqtype)
    $.get "#{config.tagsucwtURL}?tagtype=ads/tagtype:tag", (data) ->
        suggestions=data.simpletags
        #console.log "SUGG", suggestions
        qtxtlist = parse_querystring(config.querystring)
        if qtxtlist.length > 0
            sections.$breadcrumb.text('Tags: ')
            for e in qtxtlist
                sections.$breadcrumb.append("<span class='badge'>#{e}</span>&nbsp;")
            sections.$breadcrumb.show()
        $.get config.itemsPURL, (data) ->
            theitems=data.items
            #console.log("THEITEMS", theitems)
            sections.$count.text("#{theitems.length} papers. ")
            sections.$count.show()
            thecount=data.count
            itemlist=("items=#{encodeURIComponent(i.basic.fqin)}" for i in theitems)
            biblist=(i.basic.name for i in theitems)
            bibstring = biblist.join("\n")
            sections.$bigquery.val(bibstring)
            sections.$bigqueryform.attr("action", config.bq2url)
            sections.$bigqueryform.attr("hello", "world")
            itemsq=itemlist.join("&")
            $.get "#{config.itPURL}?#{itemsq}", (data)->
                #console.log "POSTINGS", data.postings, config.fqpn
                [stags, notes]=get_taggings(data)
                postings={}
                times={}
                for own k,v of data.postings
                    if v[0] > 0
                        postings[k]=(e.posting.postfqin for e in v[1])
                        ptimes = (e.posting.whenposted for e in v[1] when e.posting.postfqin==config.fqpn)
                        #console.log "PTIMES", ptimes
                        if ptimes.length > 0
                            times[k]=ptimes[0]#currently ignore others if there are more than one post
                        else
                            times[k]=0#earliest :-)
                    else
                        postings[k]=[]
                        times[k] = 0
                #console.log "TIMES ARE ROCKING", times
                sorteditems = _.sortBy(theitems, (i) -> return -Date.parse(times[i.basic.fqin]))
                for i in sorteditems
                    i.whenposted = times[i.basic.fqin]
                #console.log "SORTEDITEMS"
                #for i in sorteditems
                #console.log i.basic.fqin, i.whenposted, i.whenpostedsecs 
                ido=
                    stags:stags
                    postings:postings
                    notes:notes
                    $el:sections.$items
                    items: sorteditems
                    noteform: true
                    nameable: false
                    itemtype:'ads/pub'
                    memberable:config.memberable
                    suggestions : suggestions
                    pview: config.pview
                plinv=new itemsdo.ItemsFilterView(ido)
                plinv.render()
                #possible A&A issue
                eb = (err) ->
                    #console.log("ERR", err)
                    for d in theitems
                        format_item(plinv.itemviews[d.basic.fqin].$('.searchresultl'),d)
                cb = (data) ->
                    ##console.log "CBDATA", JSON.stringify(data), data.response.docs
                    thedocs = {}
                    for d in data.response.docs
                        thedocs[d.bibcode]=d
                    docnames = (d.bibcode for d in data.response.docs)
                    for d in theitems
                        if d.basic.name in docnames
                            e=thedocs[d.basic.name]
                        else
                            e={}
                        format_item(plinv.itemviews[d.basic.fqin].$('.searchresultl'),e)
                #console.log "ITTYS", theitems, (e.basic.fqin for e in theitems)
                syncs.send_bibcodes(config.bq1url, theitems, cb, eb)
    loc = config.loc
    nonqloc=loc.href.split('?')[0]
    if sections.$ua.attr('data') is 'off'
        if nonqloc is loc.href
            urla=loc+"?userthere=true"
        else
            urla=loc+"&userthere=true"
        sections.$ua.attr('href', urla)
        sections.$ua.attr('data', 'on')

root.postablefilter = 
    do_postable_info: do_postable_info
    do_postable_filter: do_postable_filter