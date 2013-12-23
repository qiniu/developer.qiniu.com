#!/usr/bin/env python
#-*- coding: utf-8 -*-

import commands
import time
import sys
import os
import re
import shutil
from optparse import OptionParser
import StringIO

cwddir = os.getcwd()
docsroot = cwddir + "/docs.qiniu.com"
guideroot = docsroot + "/guide"
faqroot = docsroot + "/faq"
toolsroot = docsroot + "/tools"
thirdresroot = docsroot + "/third-res"
apiroot = docsroot + "/apidoc"              # apidoc repo dir
devtoolsroot = docsroot + "/devtools"       # docs of devtools
commondir = docsroot + "/common-file"       # common layouts and static files
jklpath = cwddir + "/jkl"
jklconfpath = cwddir + "/_jekyll_qiniu.yml"

githost = "https://github.com"
doc_lists = ["docs.qiniu.com","apidoc","c-sdk","php-sdk","perl-sdk","csharp-sdk","android-sdk","ios-sdk","python-sdk","ruby-sdk","java-sdk","nodejs-sdk","go-sdk"]

# where is common layout files
commonpos = ("qiniu", "docs.qiniu.com", "develop")
#commonpos = ("icattlecoder", "docs.qiniu.com", "feature_qrsbox")

def addtime(f):
    def wrap(*args):
        t = time.localtime()
        print "%d-%d-%d %d:%d:%d " % (t.tm_year, t.tm_mon, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec),
        f(*args)
    return wrap

@addtime
def logprint(message):
    print message


def execcmd(cmd):
    logprint("EXEC: %s" % cmd)
    status, output = commands.getstatusoutput(cmd)
    logprint(output)
    if status != 0:
        return False
    return True


def initcheck():
    if not os.path.exists(docsroot):
        try:
            os.mkdir(docsroot)
        except Exception as e:
            logprint(str(e))
            return False

    if not os.path.exists(jklconfpath):
        logprint("Error: Cannot find %s" % jklconfpath)
        return False

    if not (os.path.isfile(jklpath) and os.access(jklpath, os.X_OK)):
        logprint("Error: Cannot find executable jkl at %s" % os.getcwd())
        return False
    return True


def curl(url, dest):
    logprint("Info: downloading %s" % url)
    if not execcmd("curl -fsSkL %s -o %s" % (url, dest)):
        logprint("Error: download failed")
        return False
    else:
        logprint("Info: download finished")
        return True


def untar(srcfile):
    """
    Untar a tar.gz file
    """
    oldcwd = os.getcwd()
    os.chdir(os.path.dirname(srcfile))
    logprint("Info: untar %s" % srcfile)
    if not execcmd("tar zxvf %s" % srcfile):
        logprint("Error: untar failed")
        os.chdir(oldcwd)
        return False
    else:
        logprint("Info: untar finished")
        os.chdir(oldcwd)
        return True


def jklupload(dirpath):
    """
    upload files to a bucket by tool `jkl`
    """
    oldcwd = os.getcwd()
    os.chdir(dirpath)
    logprint("Info: uploading %s" % dirpath)

    if not execcmd("%s --qiniu-config %s --qiniu --verbose" % (jklpath, jklconfpath)):
        logprint("Error: Failed to uplaod docs")
        os.chdir(oldcwd)
        return False
    else:
        logprint("Info: upload docs finish")
        os.chdir(oldcwd)
        return True


def getcommonfile(user, repo, branch):
    """
    Get common layout files from repo docs.qiniu.com
    """
    oldcwd = os.getcwd()

    if os.path.exists(commondir):
        shutil.rmtree(commondir)

    os.mkdir(commondir)
    os.chdir(commondir)

    downurl, package, untarpath, rootpath, changelog, docpath = getpath(user, repo, branch)

    if not curl(downurl, package):
        logprint("Error: fail to download common file, abort.")
        os.chdir(oldcwd)
        return False

    if not untar(package):
        logprint("Error: fail to untar, abort.")
        os.chdir(oldcwd)
        return False

    layoutpath = "/".join([untarpath, "_layouts"])
    configpath = "/".join([untarpath, "_config.yml"])

    # copy _layouts/ and _config.yml to .
    if not (execcmd("cp -R %s %s" % (layoutpath, commondir)) \
            and execcmd("cp -R %s %s" % (configpath, commondir))):
        logprint("Error: cp config file failed")
        os.chdir(oldcwd)
        return False
    #
    # TODO:remove tmp file
    #
    os.chdir(oldcwd)
    return True


def getversion(path):
    """
    Parse lasted version from CHANGELOG.md
    return: string
    """
    try:
        f = open(path)
        buf = f.read()
    except Exception as e:
        logprint("Error: %s" % str(e))
        sys.exit(1)

    r = re.compile("[vV][0-9]\.[0-9]\.[0-9]")
    l = r.findall(buf)
    if len(l) > 0 :
        logprint("Info: get lasted version %s" % l[0][:2])
        return l[0][:2]
    else:
        logprint("Error: Can not find version info")
        return None


# update docs of a repo
def docupdate(user, repo, branch):

    if repo == "docs.qiniu.com":    # update /guide /tools /faq and static files
        downurl, package, untarpath, rootpath, changelog, docpath = getpath(user, repo, branch)

        # force to update layout files
        if not getcommonfile(*commonpos):
            return False
        if not curl(downurl, package):
            return False
        if not untar(package):
            return False
        ver = getversion(untarpath + "/CHANGELOG.md")

        execcmd("rm -rf %s %s %s %s" % ("/".join([guideroot,"guide", ver]), "/".join([toolsroot, "tools", ver]), "/".join([faqroot, "faq", ver]), "/".join([thirdresroot, "third-res", ver])))
        execcmd("mkdir -p %s %s %s %s" % ("/".join([guideroot,"guide", ver]), "/".join([toolsroot, "tools", ver]), "/".join([faqroot, "faq", ver]), "/".join([thirdresroot, "third-res", ver])))

        execcmd("cp -R %s %s" % (untarpath + "/guide/*", guideroot + "/guide/" + ver))
        execcmd("cp -R %s %s" % (untarpath + "/tools/*", toolsroot + "/tools/" + ver))
        execcmd("cp -R %s %s" % (untarpath + "/faq/*", faqroot + "/faq/" + ver))
        execcmd("cp -R %s %s" % (untarpath + "/third-res/*", thirdresroot + "/third-res/" + ver))

        execcmd("cp %s %s" % (commondir + "/_config.yml", guideroot))
        execcmd("cp %s %s" % (commondir + "/_config.yml", toolsroot))
        execcmd("cp %s %s" % (commondir + "/_config.yml", faqroot))
        execcmd("cp %s %s" % (commondir + "/_config.yml", thirdresroot))

        execcmd("cp -R %s %s" % (commondir + "/_layouts", guideroot))
        execcmd("cp -R %s %s" % (commondir + "/_layouts", toolsroot))
        execcmd("cp -R %s %s" % (commondir + "/_layouts", faqroot))
        execcmd("cp -R %s %s" % (commondir + "/_layouts", thirdresroot))

        redirectFolder("/".join([guideroot, "guide", ver]), "/".join([guideroot, "guide"]))
        redirectFolder("/".join([faqroot, "faq", ver]), "/".join([faqroot, "faq"]))
        redirectFolder("/".join([toolsroot, "tools", ver]), "/".join([toolsroot, "tools"]))
        redirectFolder("/".join([thirdresroot, "third-res", ver]), "/".join([thirdresroot, "third-res"]))

        jklupload(untarpath)    # upload statics of docs.qiniu.com
        jklupload(guideroot)
        jklupload(toolsroot)
        jklupload(faqroot)
        jklupload(thirdresroot)

        return True

    if repo.find("-sdk") >= 0 or repo == "apidoc":
        relrepo = repo
        if repo == "go-sdk": relrepo = "api"
        if repo == "apidoc": repo = "api"

        downurl, package, untarpath, rootpath, changelog, docpath = getpath(user, relrepo, branch)

        # use current layouts if exists, else fetch it
        if not os.path.exists(commondir):
            if not getcommonfile(*commonpos):
                return False

        # download repo tar
        curl(downurl, package)
        untar(package)
        ver = getversion(changelog)
        verpath = "/".join([rootpath, repo, ver])

        # make new upload dir of the repo
        execcmd("rm -rf %s" % verpath)
        execcmd("mkdir -p %s" % verpath)

        # copy doc files into upload dir
        execcmd("cp -R %s %s" % (docpath + "/*", verpath))

        # copy config files for jkl
        execcmd("cp %s %s" % (commondir + "/_config.yml", rootpath))
        execcmd("cp -R %s %s" % (commondir + "/_layouts", rootpath))

        # add version header in all markdown files in upload dir
        adddirver(verpath, ver)

        # generate index.html from README.md
        if os.path.exists(verpath + "/README.md"):
            execcmd("cp %s %s" % (verpath + "/README.md", verpath + "/index.md"))

        # generate redirect html file
        redirectFolder(verpath, "/".join([rootpath, repo]))

        # generate sites and upload to bucket
        jklupload(rootpath)


def redirectFolder(srcdir, todir):
    """
    在todir中生成srcdir中各文件相应的跳转页面
    """
    if srcdir.endswith("/"): srcdir = srcdir[:-1]
    if todir.endswith("/"): todir = todir[:-1]
    logprint("Info: redirectFolder %s to %s" % (srcdir, todir))

    for root, dirs, files in os.walk(srcdir):
        for fname in files:
            fpath = "/".join([root, fname])
            rel = os.path.relpath(fpath, todir)
            relself = os.path.relpath(fpath, srcdir)
            if fpath.endswith(".md") or \
                    fpath.endswith(".markdown") or \
                    fpath.endswith(".html"):
                redirect = os.path.splitext(rel)[0] + ".html"
                topath = "/".join([todir, relself])
                topath = os.path.splitext(topath)[0] + ".html"
                gen301file(topath, redirect)


def forceCreate(filepath, mode):
    """
    当文件所属的目录不存在时，自动创建，并返回文件句柄
    """
    logprint("Info: Create file `%s`" % filepath)
    basedir = os.path.dirname(filepath)
    if not os.path.exists(basedir):
        os.makedirs(basedir)
    try:
        fd = open(filepath, mode)
    except Exception as e:
        logprint("Error: " + str(e))
        return None

    return fd


def gen301file(topath, rdrcturl):
    """
    * topath: path to put the html file
    * rdrcturl: redirect to where
    """
    logprint("Info: gen301file: %s redirect to %s" % (topath, rdrcturl))
    content = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="Content-Language" content="zh-CN">
        <meta http-equiv="refresh" content="0.1;url=%s">
    </head>
    <body></body>
    </html>
    """  % rdrcturl
    try:
        f = forceCreate(topath, "w+")
        f.seek(0)
        f.write(content)
        f.truncate()
    except Exception as e:
        logprint("Error: " + str(e))
        return False
    return True


def adddirver(dirpath, ver):
    """
    Call addversion on all files under `dirpath`
    """
    for root, dirs, files in os.walk(dirpath):
        for fname in files:
            fpath = "/".join([root, fname])
            if fpath.endswith(".md") or fpath.endswith(".markdown"):
                addversion(fpath, ver)


def addversion(mdpath, version):
    """
    Add attribute "version" to a markdown file
    """
    logprint("AddVersion: add `version: %s` to %s" % (version, mdpath))
    try:
        f = open(mdpath, 'r+')
        oribuf = f.read()
    except Exception as e:
        logprint("AddVersion: %s" % str(e))
        return False

    buf = ''
    rbuf = StringIO.StringIO(oribuf)
    for line in rbuf.readlines():
        if line.startswith("title:"):
            line = "".join([line, "version: %s\n" % version])
        buf = "".join([buf, line])
        if line.startswith("version:"):
            f.close()
            return True
    f.seek(0)
    f.write(buf)
    f.truncate()
    f.close()
    return True


# I need downurl, docpath, changelog, untarpath, rootpath, package
# repo: go-sdk -> api
def getpath(gituser, repo, branch):
    baseurl = "/".join([githost, gituser])
    downurl = "/".join([baseurl, repo, "archive", branch+".tar.gz"])
    untarpath = "/".join([docsroot, "-".join([repo, branch])])
    changelog = untarpath + "/CHANGELOG.md"
    rootpath = "/".join([docsroot, repo])
    package = "/".join([docsroot, ".".join([repo, branch, "tar.gz"])])

    if repo in ("csharp-sdk", "ios-sdk"):
        docpath = untarpath + "/Docs/"
    elif repo == "apidoc":
        docpath = untarpath + "/api/"
    else:
        docpath = untarpath + "/docs/"

    return downurl, package, untarpath, rootpath, changelog, docpath


def optparse():
    """
    Parse args.
    """
    usage = 'Usage: ./doc-update.py [options]'
    parser = OptionParser(usage=usage)
    parser.add_option('-B', '--branch', help=u'choose which branch to update')
    parser.add_option('-R', '--repo', help=u'set repo name: docs.qiniu.com | apidoc | c-sdk | php-sdk | perl-sdk | csharp-sdk | android-sdk | ios-sdk | python-sdk | ruby-sdk | java-sdk | nodejs-sdk | go-sdk')
    parser.add_option('-U', '--user', help=u'set github name')

    options = parser.parse_args()[0]

    if options.repo:
        repo = options.repo
    else:
        repo = "alldocs"

    if options.branch:
        branch = options.branch
    else:
        branch = "master"

    if options.user:
        user = options.user
    else:
        user = "qiniu"

    return user, repo, branch



if __name__ == "__main__":

    user, repo, branch = optparse()

    if not initcheck():
        logprint("Error: initcheck failed, abort.")
        sys.exit(1)

    if repo == "alldocs":
        for x in doc_lists:
            docupdate(user, x, branch)
            logprint("")
    else:
        docupdate(user, repo, branch)
