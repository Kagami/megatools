AC_PREREQ(2.60)
AC_INIT([megatools],[1.9.98],[megous@megous.com],[megatools])
AC_CONFIG_SRCDIR([Makefile.am])
AC_CONFIG_MACRO_DIR([m4])
AC_CONFIG_HEADER([config.h])
AM_INIT_AUTOMAKE([silent-rules foreign subdir-objects -Wno-portability])
AM_MAINTAINER_MODE
AM_SILENT_RULES([yes])

AC_PROG_CC
AC_PROG_RANLIB
AM_PROG_CC_C_O
#AC_LIBTOOL_WIN32_DLL
#AM_PROG_LIBTOOL
AC_HEADER_STDC

# Define requirements

GLIB_VERSION="2.32.0"
LIBCURL_REQUIRES="libcurl"
OPENSSL_REQUIRES="openssl"
FUSE_REQUIRES="fuse"
MEGA_REQUIRES="gio-2.0 >= $GLIB_VERSION $LIBCURL_REQUIRES $OPENSSL_REQUIRES"

# for libmega.pc
AC_SUBST(MEGA_REQUIRES)

# check for glib/gio
AM_PATH_GLIB_2_0([$GLIB_VERSION],,AC_MSG_ERROR([Glib $GLIB_VERSION or later is required to build megatools]),[gobject gio])

# check openssl
PKG_CHECK_MODULES(OPENSSL, [$OPENSSL_REQUIRES])
AC_SUBST(OPENSSL_CFLAGS)
AC_SUBST(OPENSSL_LIBS)

# check libcurl
PKG_CHECK_MODULES(LIBCURL, [$LIBCURL_REQUIRES])
AC_SUBST(LIBCURL_CFLAGS)
AC_SUBST(LIBCURL_LIBS)

# check fuse
AC_ARG_WITH([fuse],
  AS_HELP_STRING([--without-fuse], [Ignore presence of fuse and disable it]))

AS_IF([test "x$with_fuse" != "xno"],
  [PKG_CHECK_MODULES(FUSE, [$FUSE_REQUIRES], [ENABLE_FUSE=yes], [ENABLE_FUSE=no])],
  [ENABLE_FUSE=no])

AS_IF([test "x$ENABLE_FUSE" = "xyes"],
  [
    AC_SUBST(FUSE_CFLAGS)
    AC_SUBST(FUSE_LIBS)
  ],
    [AS_IF([test "x$with_fuse" = "xyes"],
      [AC_MSG_ERROR([fuse support requested but not found])
    ])
])

AM_CONDITIONAL([ENABLE_FUSE], [test "x$ENABLE_FUSE" = "xyes"])

# enable dev compiler warnings
AC_ARG_ENABLE([warnings], AC_HELP_STRING([--enable-warnings], [Build with compiler warnings enabled.]))
AS_IF([test "x$enable_warnings" = "xyes"], [
  CFLAGS="$CFLAGS -Wall -Wextra -Wno-unused-parameter -Wno-unused-variable -Wno-unused-local-typedefs -Wno-sign-compare -Wno-pointer-sign -Wno-missing-field-initializers"

  AS_IF([$CC --version | head -n1 | grep '(GCC) 4\.8' &>/dev/null], [CFLAGS="$CFLAGS -Wno-unused-local-typedefs"])
], [
  CFLAGS="$CFLAGS -Wno-pointer-sign -Wno-unused-variable"
  enable_warnings=no
])

# enable docs building
AC_ARG_ENABLE([docs-build], AC_HELP_STRING([--enable-docs-build], [Build man pages instead of using bundled ones.]))
AM_CONDITIONAL([ENABLE_DOCS_BUILD], [test "x$enable_docs_build" = xyes])
AS_IF([test "x$enable_docs_build" = "xyes"], [
  AC_PATH_PROG([A2X], [a2x], [no])
  AS_IF([test "x$A2X" = xno], [
    AC_MSG_ERROR([a2x is required to build docs, install asciidoc])
  ])
], [enable_docs_build=no])

AC_CONFIG_FILES([
  Makefile
])

AC_OUTPUT

cat << EOF

Configured features:

  docs build: $enable_docs_build
  warnings: $enable_warnings
  megafs: $ENABLE_FUSE (requires fuse)

Run make now.

NOTE: On FreeBSD, you need to use GNU make (gmake)

EOF
